// The browser's side of `GET /live` (SEC-117 › docs/specs/platform.md › The live socket): one connection for the
// tab, which follows any topics the pages ask for and passes their notices on. It holds no React and reads no
// global but the timers, so its reconnecting, its resubscribing and its fallback are tested in Node.

import { z } from "zod";

import { parseJson } from "@/lib/json";

/** Who wrote or saw a message. */
export type Side = "customer" | "seller";

/** What changed, as the server's notices name it: identifiers and numbers, never a text (design decision 10). */
export type LiveNotice =
  | { type: "order"; orderId: string; status: string }
  | { type: "message"; orderId: string; seq: number; from: Side }
  | { type: "seen"; orderId: string; by: Side; seq: number };

/**
 * A notice, or `synced`: the followed topics were (re)subscribed or the server sent `resync`, so a page reads
 * its state again (design decision 12).
 */
export type LiveEvent = LiveNotice | { type: "synced" };

/** The part of a browser WebSocket the client uses, so a test can stand in for it. */
export type LiveSocket = {
  send(data: string): void;
  close(): void;
  onopen: ((event: Event) => void) | null;
  onmessage: ((event: MessageEvent) => void) | null;
  onclose: ((event: CloseEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
};

/** What the client is given: where to connect and how to get a ticket for each topic. */
export type LiveOptions = {
  url: () => string;
  /** One ticket for each topic it may follow, minted for this connection; a topic left out is not followed. */
  mint: (topics: string[]) => Promise<Record<string, string>>;
  createSocket: (url: string) => LiveSocket;
  random?: () => number;
};

/** A connection follows at most 20 topics, and the server closes one that asks for a 41st frame. */
const MAX_TOPICS = 20;
/** The wait before reconnecting after the 1st, 2nd... failure to open; the last repeats (design decision 13). */
const BACKOFF_SECONDS = [1, 2, 4, 8, 16, 30];
/** After this many failures in a row the pages poll until a connection opens (design decision 29). */
const POLL_AFTER_FAILURES = 3;
/** How long the connection stays after its last follower leaves, so moving between pages keeps it. */
const IDLE_CLOSE_MS = 2000;
/** The wait is spread by this much either way, so tabs that lost the server together do not return together. */
const JITTER = 0.2;

type Frame =
  { type: "subscribed"; topic: string } | { type: "refused" } | { type: "resync" } | LiveNotice;

const side = z.enum(["customer", "seller"]);
const frame = z.discriminatedUnion("type", [
  z.object({ type: z.literal("subscribed"), topic: z.string() }),
  z.object({ type: z.literal("refused") }),
  z.object({ type: z.literal("resync") }),
  z.object({ type: z.literal("order"), orderId: z.string(), status: z.string() }),
  z.object({ type: z.literal("message"), orderId: z.string(), seq: z.number(), from: side }),
  z.object({ type: z.literal("seen"), orderId: z.string(), seq: z.number(), by: side }),
]);

/** A frame the server sent, or nothing for text that is not one of the documented frames. */
export function parseFrame(data: unknown): Frame | undefined {
  return typeof data === "string" ? parseJson(data, frame) : undefined;
}

/** The wait before the next attempt after `failures` failures in a row, in milliseconds. */
export function reconnectDelay(failures: number, random: () => number): number {
  const seconds = BACKOFF_SECONDS[Math.min(Math.max(failures - 1, 0), BACKOFF_SECONDS.length - 1)];
  return Math.round(seconds * 1000 * (1 + (random() * 2 - 1) * JITTER));
}

export class LiveClient {
  readonly #options: LiveOptions;
  readonly #random: () => number;
  /** The topics followed and how many followers each has. */
  readonly #topics = new Map<string, number>();
  readonly #followers = new Set<{ listener: (event: LiveEvent) => void }>();
  readonly #statusListeners = new Set<() => void>();
  readonly #subscribed = new Set<string>();
  /** The topics a subscribe frame was sent for and the server has not answered, in the order sent. */
  #pending: string[] = [];
  /** The topics whose ticket was refused and minted again once on this connection. */
  readonly #retried = new Set<string>();
  #socket: LiveSocket | undefined;
  /** Counts connections, so what a stale one reports is ignored. */
  #generation = 0;
  #connecting = false;
  #failures = 0;
  #polling = false;
  #retry: ReturnType<typeof setTimeout> | undefined;
  #idle: ReturnType<typeof setTimeout> | undefined;

  constructor(options: LiveOptions) {
    this.#options = options;
    this.#random = options.random ?? Math.random;
  }

  /** Whether the connection has failed to open several times, so the pages poll instead. */
  get polling(): boolean {
    return this.#polling;
  }

  /** Calls `listener` when `polling` changes. */
  onPollingChange(listener: () => void): () => void {
    this.#statusListeners.add(listener);
    return () => this.#statusListeners.delete(listener);
  }

  /**
   * Follows `topics` and hands every notice of the connection to `listener`, which filters what concerns it.
   * Returns the way to stop; the connection closes shortly after its last follower leaves.
   */
  follow(topics: readonly string[], listener: (event: LiveEvent) => void): () => void {
    const follower = { listener };
    const own = [...new Set(topics)];
    this.#followers.add(follower);
    for (const topic of own) this.#topics.set(topic, (this.#topics.get(topic) ?? 0) + 1);
    clearTimeout(this.#idle);
    this.#idle = undefined;
    this.#wake();

    return () => {
      if (!this.#followers.delete(follower)) return;
      for (const topic of own) {
        const left = (this.#topics.get(topic) ?? 1) - 1;
        if (left > 0) this.#topics.set(topic, left);
        else this.#topics.delete(topic);
      }
      if (this.#topics.size === 0) this.#idle = setTimeout(() => this.#stop(), IDLE_CLOSE_MS);
    };
  }

  #wanted(): string[] {
    return [...this.#topics.keys()].slice(0, MAX_TOPICS);
  }

  #emit(event: LiveEvent) {
    for (const { listener } of this.#followers) listener(event);
  }

  #setPolling(polling: boolean) {
    if (this.#polling === polling) return;
    this.#polling = polling;
    for (const listener of this.#statusListeners) listener();
  }

  #wake() {
    if (this.#socket) this.#subscribeMissing();
    else if (!this.#connecting && this.#retry === undefined && this.#topics.size > 0) {
      void this.#connect();
    }
  }

  async #connect() {
    const generation = ++this.#generation;
    this.#connecting = true;
    let tickets: Record<string, string> = {};
    try {
      tickets = await this.#options.mint(this.#wanted());
    } catch {
      // A failed mint is a failed attempt, counted below.
    }
    if (generation !== this.#generation) return;
    this.#connecting = false;
    if (Object.keys(tickets).length === 0) {
      this.#failed();
      return;
    }

    const socket = this.#options.createSocket(this.#options.url());
    this.#socket = socket;
    let opened = false;
    socket.onopen = () => {
      if (generation !== this.#generation) return;
      opened = true;
      this.#failures = 0;
      this.#setPolling(false);
      this.#subscribe(tickets);
      this.#subscribeMissing();
    };
    socket.onmessage = (event) => {
      if (generation === this.#generation) this.#receive(event.data);
    };
    socket.onclose = () => {
      if (generation !== this.#generation) return;
      this.#socket = undefined;
      this.#reset();
      // A connection that was followed and then closed starts again from the first wait; one that never
      // opened counts as a failure.
      if (opened) this.#reconnect();
      else this.#failed();
    };
    socket.onerror = () => {
      // The close that follows an error does the work.
    };
  }

  /** Sends a subscribe frame for each topic that has a ticket. */
  #subscribe(tickets: Record<string, string>) {
    for (const [topic, ticket] of Object.entries(tickets)) {
      if (
        !this.#topics.has(topic) ||
        this.#subscribed.has(topic) ||
        this.#pending.includes(topic)
      ) {
        continue;
      }
      this.#socket?.send(JSON.stringify({ type: "subscribe", ticket }));
      this.#pending.push(topic);
    }
  }

  /** Mints and sends what the followers want and the connection does not follow yet. */
  #subscribeMissing() {
    const generation = this.#generation;
    const missing = this.#wanted().filter(
      (topic) => !this.#subscribed.has(topic) && !this.#pending.includes(topic),
    );
    if (missing.length === 0 || !this.#socket) return;
    // The server has no frame to stop following, so topics left behind by pages that went away hold their
    // places until the next connection; one made now carries only the wanted ones.
    if (this.#subscribed.size + this.#pending.length + missing.length > MAX_TOPICS) {
      this.#recycle();
      return;
    }
    void this.#options.mint(missing).then(
      (tickets) => {
        if (generation === this.#generation) this.#subscribe(tickets);
      },
      () => undefined,
    );
  }

  #receive(data: unknown) {
    const frame = parseFrame(data);
    if (!frame) return;
    switch (frame.type) {
      case "subscribed": {
        this.#pending = this.#pending.filter((topic) => topic !== frame.topic);
        this.#subscribed.add(frame.topic);
        if (this.#pending.length === 0) this.#emit({ type: "synced" });
        return;
      }
      case "refused": {
        const topic = this.#pending.shift();
        // Mint once more for a ticket that was used or had expired, and no more: each frame counts against
        // the 40 the server allows.
        if (topic && this.#topics.has(topic) && !this.#retried.has(topic)) {
          this.#retried.add(topic);
          const generation = this.#generation;
          void this.#options.mint([topic]).then(
            (tickets) => {
              if (generation === this.#generation) this.#subscribe(tickets);
            },
            () => undefined,
          );
        }
        return;
      }
      case "resync":
        this.#emit({ type: "synced" });
        return;
      default:
        this.#emit(frame);
    }
  }

  #reset() {
    this.#subscribed.clear();
    this.#pending = [];
    this.#retried.clear();
  }

  #failed() {
    this.#failures += 1;
    if (this.#failures >= POLL_AFTER_FAILURES) this.#setPolling(true);
    this.#reconnect();
  }

  #reconnect() {
    clearTimeout(this.#retry);
    if (this.#topics.size === 0) return;
    this.#retry = setTimeout(
      () => {
        this.#retry = undefined;
        void this.#connect();
      },
      reconnectDelay(this.#failures, this.#random),
    );
  }

  /** Closes the connection and opens a new one at once, for the topics wanted now. */
  #recycle() {
    this.#close();
    void this.#connect();
  }

  #close() {
    this.#generation += 1;
    this.#connecting = false;
    const socket = this.#socket;
    this.#socket = undefined;
    this.#reset();
    if (socket) {
      socket.onopen = null;
      socket.onmessage = null;
      socket.onclose = null;
      socket.onerror = null;
      socket.close();
    }
  }

  #stop() {
    this.#idle = undefined;
    this.#close();
    clearTimeout(this.#retry);
    this.#retry = undefined;
    this.#failures = 0;
    this.#setPolling(false);
  }
}
