/**
 * Who collects an order: the name the seller calls and a Vietnamese phone number, given with every order
 * (SEC-76 › decision 7). The rules mirror the server's (server/internal/order/contact.go), which decides.
 */
export type Contact = { name: string; phone: string };

/** As the server keeps it, the same as an account's display name. */
export const MAX_NAME_LENGTH = 50;

const PHONE = /^0[0-9]{9}$/;
const STORAGE_KEY = "secondbite.contact";

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

/** The contact given last in this browser, so the next order needs only a check. */
export function readContact(): Contact {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    if (value && typeof value === "object" && "name" in value && "phone" in value) {
      return { name: String(value.name), phone: String(value.phone) };
    }
  } catch {
    // Storage blocked or the value unreadable: start with empty fields.
  }
  return { name: "", phone: "" };
}

export function saveContact(contact: Contact): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contact));
  } catch {
    // Storage blocked: the fields are asked again next time.
  }
}
