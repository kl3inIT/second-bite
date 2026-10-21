/**
 * The address of a photo the backend serves (`smallPath`, `largePath`, a store's logo): the browser
 * reaches the backend on its own origin under /api, as every generated call does (./client.ts).
 */
export function photoUrl(path: string): string {
  return `/api${path}`;
}
