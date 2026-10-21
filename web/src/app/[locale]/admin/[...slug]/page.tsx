import { notFound } from "next/navigation";

import { requireAdmin } from "@/features/identity/current-account";

// An admin address no page answers shows the admin's not-found page, inside the frame for an admin; someone
// whose session has ended signs in first.
export default async function AdminCatchAll({ params }: PageProps<"/[locale]/admin/[...slug]">) {
  const { slug } = await params;
  await requireAdmin(`/admin/${slug.join("/")}`);
  notFound();
}
