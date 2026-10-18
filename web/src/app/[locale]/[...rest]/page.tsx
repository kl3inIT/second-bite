import { notFound } from "next/navigation";

// An address under a known language that no page answers shows that language's not-found page.
export default function CatchAll() {
  notFound();
}
