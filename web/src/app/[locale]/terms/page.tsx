import type { Metadata } from "next";

import { LegalPage, legalMetadata } from "@/features/legal/legal-page";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/terms">): Promise<Metadata> {
  return legalMetadata("Terms", (await params).locale);
}

export default function TermsPage() {
  return <LegalPage namespace="Terms" />;
}
