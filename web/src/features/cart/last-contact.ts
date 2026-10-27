"use client";

import { z } from "zod";

import { stored } from "@/lib/stored";

import type { Contact } from "./contact";

// Kept apart from contact.ts, whose rules server pages use too: browser storage is for client code only.
const lastContact = stored<Contact>(
  "secondbite.contact",
  z.object({ name: z.string(), phone: z.string() }),
  { name: "", phone: "" },
);

/** The contact given last in this browser, so the next order needs only a check. */
export function readContact(): Contact {
  return lastContact.read();
}

export function saveContact(contact: Contact): void {
  lastContact.save(contact);
}
