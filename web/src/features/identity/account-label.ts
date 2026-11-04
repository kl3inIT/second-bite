/**
 * What names a signed-in account where a person reads it: the name they chose, else the address they signed in
 * with, else their username (SEC-193: an account made with a username has no address).
 */
export function accountLabel(account: {
  displayName: string;
  email: string;
  username: string;
}): string {
  return account.displayName || account.email || account.username;
}

/** The address of an account, or its username when it has none: what a line under the name shows. */
export function accountHandle(account: { email: string; username: string }): string {
  return account.email || account.username;
}
