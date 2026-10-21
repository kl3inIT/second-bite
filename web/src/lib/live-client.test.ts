import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  LiveClient,
  parseFrame,
  reconnectDelay,
  type LiveEvent,
  type LiveSocket,
} from "./live-client";

const ORDER = "order:o1";
const SELLER = "seller:s1";

class FakeSocket implements LiveSocket {
  static all: FakeSocket[] = [];
  sent: unknown[] = [];
  closed = false;
  onopen: LiveSocket["onopen"] = null;
  onmessage: LiveSocket["onmessage"] = null;
  onclose: LiveSocket["onclose"] = null;
  onerror: LiveSocket["onerror"] = null;

  constructor() {
    FakeSocket.all.push(this);
  }

  send(data: string) {
    this.sent.push(JSON.parse(data));
  }

  close() {
    this.closed = true;
  }

  open() {
    this.onopen?.(new Event("open"));
  }

  receive(frame: unknown) {
    this.onmessage?.(new MessageEvent("message", { data: JSON.stringify(frame) }));
  }

  drop() {
    this.onclose?.(new CloseEvent("close"));
  }
}

const last = () => FakeSocket.all.at(-1)!;

/** Lets the minting promise settle. */
const settle = () => vi.advanceTimersByTimeAsync(0);

function setup(mint?: (topics: string[]) => Promise<Record<string, string>>) {
  const minted: string[][] = [];
  const client = new LiveClient({
    url: () => "ws://test/api/live",
    mint:
      mint ??
      (async (topics) => {
        minted.push(topics);
        return Object.fromEntries(topics.map((topic) => [topic, `ticket-${topic}`]));
      }),
    createSocket: () => new FakeSocket(),
    random: () => 0.5,
  });
  const events: LiveEvent[] = [];
  return { client, events, minted, listen: (e: LiveEvent) => events.push(e) };
}

beforeEach(() => {
  vi.useFakeTimers();
  FakeSocket.all = [];
});

afterEach(() => {
  vi.useRealTimers();
});

describe("parseFrame", () => {
  it("reads the documented frames", () => {
    expect(parseFrame('{"type":"subscribed","topic":"order:o1"}')).toEqual({
      type: "subscribed",
      topic: "order:o1",
    });
    expect(parseFrame('{"type":"resync"}')).toEqual({ type: "resync" });
    expect(parseFrame('{"type":"message","orderId":"o1","seq":7,"from":"seller"}')).toEqual({
      type: "message",
      orderId: "o1",
      seq: 7,
      from: "seller",
    });
  });

  it("ignores what is not a documented frame", () => {
    expect(parseFrame("not json")).toBeUndefined();
    expect(
      parseFrame('{"type":"message","orderId":"o1","seq":"7","from":"seller"}'),
    ).toBeUndefined();
    expect(parseFrame('{"type":"other"}')).toBeUndefined();
    expect(parseFrame(new ArrayBuffer(1))).toBeUndefined();
  });
});

describe("reconnectDelay", () => {
  it("backs off 1, 2, 4, 8, 16 and then 30 seconds", () => {
    const seconds = [0, 1, 2, 3, 4, 5, 6, 20].map((failures) =>
      reconnectDelay(failures, () => 0.5),
    );
    expect(seconds).toEqual([1000, 1000, 2000, 4000, 8000, 16_000, 30_000, 30_000]);
  });

  it("spreads the wait by a fifth either way", () => {
    expect(reconnectDelay(1, () => 0)).toBe(800);
    expect(reconnectDelay(1, () => 1)).toBe(1200);
  });
});

describe("a live connection", () => {
  it("subscribes with a minted ticket once open, and reports a sync when every topic is followed", async () => {
    const { client, events, minted, listen } = setup();
    client.follow([ORDER, SELLER], listen);
    await settle();
    expect(minted[0]).toEqual([ORDER, SELLER]);

    last().open();
    expect(last().sent).toEqual([
      { type: "subscribe", ticket: `ticket-${ORDER}` },
      { type: "subscribe", ticket: `ticket-${SELLER}` },
    ]);

    last().receive({ type: "subscribed", topic: ORDER });
    expect(events).toEqual([]);
    last().receive({ type: "subscribed", topic: SELLER });
    expect(events).toEqual([{ type: "synced" }]);
  });

  it("passes notices on and treats resync as a sync", async () => {
    const { client, events, listen } = setup();
    client.follow([ORDER], listen);
    await settle();
    last().open();

    last().receive({ type: "order", orderId: "o1", status: "ready" });
    last().receive({ type: "seen", orderId: "o1", by: "seller", seq: 3 });
    last().receive({ type: "resync" });

    expect(events).toEqual([
      { type: "order", orderId: "o1", status: "ready" },
      { type: "seen", orderId: "o1", by: "seller", seq: 3 },
      { type: "synced" },
    ]);
  });

  it("shares one connection between followers and mints a topic once", async () => {
    const { client, minted, listen } = setup();
    client.follow([ORDER], listen);
    client.follow([ORDER], listen);
    await settle();
    last().open();
    last().receive({ type: "subscribed", topic: ORDER });

    expect(FakeSocket.all).toHaveLength(1);
    expect(last().sent).toHaveLength(1);
    expect(minted).toEqual([[ORDER]]);
  });

  it("follows a topic added while it is open", async () => {
    const { client, minted, listen } = setup();
    client.follow([ORDER], listen);
    await settle();
    last().open();
    last().receive({ type: "subscribed", topic: ORDER });

    client.follow([SELLER], listen);
    await settle();

    expect(minted.at(-1)).toEqual([SELLER]);
    expect(last().sent.at(-1)).toEqual({ type: "subscribe", ticket: `ticket-${SELLER}` });
  });

  it("reconnects after a drop with new tickets and subscribes again", async () => {
    const { client, events, minted, listen } = setup();
    client.follow([ORDER], listen);
    await settle();
    last().open();
    last().receive({ type: "subscribed", topic: ORDER });
    events.length = 0;

    last().drop();
    await vi.advanceTimersByTimeAsync(1000);
    expect(FakeSocket.all).toHaveLength(2);
    expect(minted).toHaveLength(2);

    last().open();
    expect(last().sent).toEqual([{ type: "subscribe", ticket: `ticket-${ORDER}` }]);
    last().receive({ type: "subscribed", topic: ORDER });
    expect(events).toEqual([{ type: "synced" }]);
    expect(client.polling).toBe(false);
  });

  it("mints again once for a refused ticket, and then gives up on it", async () => {
    const { client, minted, listen } = setup();
    client.follow([ORDER], listen);
    await settle();
    last().open();

    last().receive({ type: "refused" });
    await settle();
    expect(minted).toEqual([[ORDER], [ORDER]]);
    expect(last().sent).toHaveLength(2);

    last().receive({ type: "refused" });
    await settle();
    expect(minted).toHaveLength(2);
    expect(last().sent).toHaveLength(2);
  });

  it("opens no connection when no ticket could be minted, and tries again later", async () => {
    let allowed = false;
    const { client, listen } = setup(async (topics) => (allowed ? { [topics[0]]: "ticket" } : {}));
    client.follow([ORDER], listen);
    await settle();
    expect(FakeSocket.all).toHaveLength(0);

    allowed = true;
    await vi.advanceTimersByTimeAsync(1000);
    expect(FakeSocket.all).toHaveLength(1);
  });

  it("polls after three failures to open and stops once a connection opens", async () => {
    const { client, listen } = setup();
    const changes = vi.fn();
    client.onPollingChange(changes);
    client.follow([ORDER], listen);
    await settle();

    last().drop();
    expect(client.polling).toBe(false);
    await vi.advanceTimersByTimeAsync(1000);
    last().drop();
    await vi.advanceTimersByTimeAsync(2000);
    expect(client.polling).toBe(false);
    last().drop();
    expect(client.polling).toBe(true);
    expect(changes).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(4000);
    last().open();
    expect(client.polling).toBe(false);
    expect(changes).toHaveBeenCalledTimes(2);
  });

  it("opens a new connection for the wanted topics when it would pass twenty", async () => {
    const { client, minted, listen } = setup();
    const first = Array.from({ length: 20 }, (_, index) => `order:a${index}`);
    const stop = client.follow(first, listen);
    await settle();
    last().open();
    for (const topic of first) last().receive({ type: "subscribed", topic });
    stop();

    client.follow(["order:b"], listen);
    await settle();

    expect(FakeSocket.all).toHaveLength(2);
    expect(FakeSocket.all[0].closed).toBe(true);
    expect(minted.at(-1)).toEqual(["order:b"]);
  });

  it("closes shortly after the last follower leaves, and not while it is followed again", async () => {
    const { client, listen } = setup();
    const stop = client.follow([ORDER], listen);
    await settle();
    last().open();

    stop();
    const again = client.follow([ORDER], listen);
    await vi.advanceTimersByTimeAsync(3000);
    expect(last().closed).toBe(false);

    again();
    await vi.advanceTimersByTimeAsync(3000);
    expect(last().closed).toBe(true);
  });
});
