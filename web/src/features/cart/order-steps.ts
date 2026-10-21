// What "Đặt món" asks before ordering (Figma L5, L6; SEC-76 decisions 2 and 3).

export type Account = { displayName: string } | null;

/** The sheet "Đặt món" opens: signing in (L5) or the name the seller calls (L6). */
export type Sheet = "signIn" | "name";

/** What "Đặt món" does next for this account: sign in, give a name, or order. */
export function nextStep(account: Account): Sheet | "ready" {
  if (!account) return "signIn";
  return account.displayName.trim() ? "ready" : "name";
}

/** Whether a cart back from signing in goes straight on to ordering, nothing left to ask. */
export function resumesReady(account: Account, resumed: boolean): boolean {
  return resumed && nextStep(account) === "ready";
}
