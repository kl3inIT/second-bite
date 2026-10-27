/**
 * Who collects an order: the name the seller calls and a Vietnamese phone number, given with every order
 * (SEC-76 › decision 7). The rules mirror the server's (server/internal/order/contact.go), which decides.
 */
export type Contact = { name: string; phone: string };

/** As the server keeps it, the same as an account's display name. */
export const MAX_NAME_LENGTH = 50;

const PHONE = /^0[0-9]{9}$/;

/** The number as stored: spaces, dots and dashes taken out, +84 written as 0. */
export function normalizedPhone(value: string): string {
  const phone = value.trim().replace(/[\s.-]/g, "");
  return phone.startsWith("+84") ? `0${phone.slice(3)}` : phone;
}

/** What is wrong with a contact, field by field; empty when it may be sent. */
export function contactProblems({ name, phone }: Contact): { name?: true; phone?: true } {
  // Counted in code points, as the server counts runes.
  const length = Array.from(name.trim()).length;
  return {
    ...(length < 1 || length > MAX_NAME_LENGTH ? { name: true } : {}),
    ...(PHONE.test(normalizedPhone(phone)) ? {} : { phone: true }),
  };
}

/** A stored number grouped to be read back at a glance: 0900 000 000. */
export function groupedPhone(phone: string): string {
  return `${phone.slice(0, 4)} ${phone.slice(4, 7)} ${phone.slice(7)}`;
}
