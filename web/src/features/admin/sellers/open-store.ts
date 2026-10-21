/**
 * An admin opening a store for its owner (SEC-64, Figma AD-OS2, AD-OS4): what the form holds and what is wrong with
 * it, checked in the browser by the seller module's own rules (server/internal/seller: a name of 1 to 100
 * characters, an address of at most 300, a phone of 9 to 15 digits, an owner's address of 3 to 254 characters), so
 * the person sees a problem at its field before the backend refuses it.
 */

/** Where every store of the pilot is; the form picks the floor and writes the rest. */
export const MALL_ADDRESS = "Tasco Mall, Việt Hưng, Long Biên";

/** Tasco Mall Long Biên, where the owner's own form pins every store too (features/seller/open-store-form). */
export const MALL_LOCATION = { latitude: 21.0565, longitude: 105.8964 };

/**
 * The floors a store of Tasco Mall sits on, as the pilot's addresses write them. Cài đặt › Khu vực keeps the malls
 * and floors once its backend exists, and replaces this list.
 */
export const mallFloors = ["Tầng B1", "Tầng 1", "Tầng 2", "Tầng 3"] as const;

export const NAME_MAX = 100;
const ADDRESS_MAX = 300;
const EMAIL_MIN = 3;
const EMAIL_MAX = 254;

export type OpenStoreDraft = {
  name: string;
  phone: string;
  floor: string;
  ownerEmail: string;
};

export type OpenStoreField = "name" | "phone" | "address" | "ownerEmail";

/** What is wrong with a field; each has its words in `admin.sellers.open.problems`. */
export type OpenStoreProblem =
  | "nameRequired"
  | "nameTooLong"
  | "addressTooLong"
  | "phoneInvalid"
  | "emailInvalid"
  | "ownerLimit";

export type OpenStoreProblems = Partial<Record<OpenStoreField, OpenStoreProblem>>;

/** The store's address as the seller module keeps it: "Tầng 1, Tasco Mall, Việt Hưng, Long Biên". */
export function addressOf(floor: string): string {
  return `${floor}, ${MALL_ADDRESS}`;
}

/**
 * Whether a phone reads as the seller module reads it (`normalizePhone`): digits and a leading +, with spaces,
 * dots, dashes and brackets between them, 9 to 15 digits in all.
 */
export function isPhone(raw: string): boolean {
  const phone = raw.trim();
  if (!/^\+?[\d .()-]+$/.test(phone)) return false;
  const digits = phone.replace(/\D/g, "").length;
  return digits >= 9 && digits <= 15;
}

/** Whether an address can receive the owner's email: something, one @, a dot in its domain, no spaces. */
export function isEmail(raw: string): boolean {
  const email = raw.trim();
  return (
    email.length >= EMAIL_MIN &&
    email.length <= EMAIL_MAX &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  );
}

/** What is wrong with each field of the form; an empty object when it can be sent. */
export function openStoreProblems(draft: OpenStoreDraft): OpenStoreProblems {
  const problems: OpenStoreProblems = {};
  const name = draft.name.trim();
  if (!name) problems.name = "nameRequired";
  else if (name.length > NAME_MAX) problems.name = "nameTooLong";
  if (!isPhone(draft.phone)) problems.phone = "phoneInvalid";
  if (addressOf(draft.floor).length > ADDRESS_MAX) problems.address = "addressTooLong";
  if (!isEmail(draft.ownerEmail)) problems.ownerEmail = "emailInvalid";
  return problems;
}

/**
 * The field a refusal of the backend belongs to, by its code (the expected `POST /admin/sellers` of SEC-64): the
 * seller module's existing codes, and the owner's address already owning five stores. A code with no field is
 * said in a toast.
 */
export function problemOfFailure(
  code: string | undefined,
): { field: OpenStoreField; problem: OpenStoreProblem } | undefined {
  switch (code) {
    case "SELLER_PHONE_INVALID":
      return { field: "phone", problem: "phoneInvalid" };
    case "SELLER_LIMIT_REACHED":
      return { field: "ownerEmail", problem: "ownerLimit" };
    case "SELLER_OWNER_EMAIL_INVALID":
      return { field: "ownerEmail", problem: "emailInvalid" };
    default:
      return undefined;
  }
}
