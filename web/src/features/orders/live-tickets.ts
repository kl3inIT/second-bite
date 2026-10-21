"use server";

import { sessionHeaders } from "@/features/identity/session";
import { createOrderLiveTicket, createSellerLiveTicket } from "@/lib/api/generated";

import { accessOf } from "./order-access";

// What a topic is called on the live socket: `order:{id}` or `seller:{id}` (docs/specs/platform.md).
const TOPIC = /^(order|seller):([\w-]{1,64})$/;
/** A connection follows at most 20 topics. */
const MAX_TOPICS = 20;

/** One ticket for a topic, or nothing when the reader may not follow it; the API answers that with an error. */
async function mint(
  kind: string,
  id: string,
  session: { cookie: string } | undefined,
): Promise<string | undefined> {
  try {
    if (kind === "seller") {
      const { data } = await createSellerLiveTicket({ path: { sellerId: id }, headers: session });
      return data.ticket;
    }
    const access = await accessOf(id);
    const { data } = await createOrderLiveTicket({
      path: { orderId: id },
      headers: { ...session, ...(access ? { "Order-Access": access } : {}) },
    });
    return data.ticket;
  } catch {
    return undefined;
  }
}

/**
 * Mints a live ticket for each topic the reader may follow (design decisions 3 and 28): it forwards the session
 * cookie and, for an order placed without signing in, the access from the httpOnly cookie, which never reaches
 * the browser. A topic the API refuses is left out. It runs at every (re)connection, since a ticket works once.
 */
export async function mintLiveTickets(topics: string[]): Promise<Record<string, string>> {
  const valid = [...new Set(topics)].slice(0, MAX_TOPICS).flatMap((topic) => {
    const match = TOPIC.exec(topic);
    return match ? [{ topic, kind: match[1], id: match[2] }] : [];
  });
  if (valid.length === 0) return {};

  const session = await sessionHeaders();
  const tickets = await Promise.all(valid.map(({ kind, id }) => mint(kind, id, session)));
  return Object.fromEntries(
    valid.flatMap(({ topic }, index) => (tickets[index] ? [[topic, tickets[index]]] : [])),
  );
}
