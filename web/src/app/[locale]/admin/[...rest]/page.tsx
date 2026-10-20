import { notFound } from "next/navigation";

// It renders nothing of its own to navigate to instantly, so it is left out of that check.
export const instant = false;

// An admin address that no admin page answers shows the admin's not-found page, inside the shell.
export default function AdminCatchAll() {
  notFound();
}
