/**
 * The code a store with no owner left is expected to be refused with when it is brought back (SEC-65); the toast
 * says why instead of "try again". The backend does not refuse it yet.
 */
export const OWNERLESS_CODE = "SELLER_HAS_NO_OWNER";
