import type { Metadata } from "next";

import { AdminNotFound } from "@/features/admin/admin-not-found";

// Never indexed: one robots tag of its own. Calling notFound() here would happen inside the admin layout's
// Suspense, where Next.js writes a robots tag into the head and its client boundary another into the body.
export const metadata: Metadata = { robots: { index: false, follow: false } };

// An admin address that no admin page answers shows the admin's not-found page, inside the shell (AD-TT5). A page
// or a record that does not exist calls notFound(), which shows the same page through admin/not-found.tsx.
export default function AdminCatchAll() {
  return <AdminNotFound />;
}
