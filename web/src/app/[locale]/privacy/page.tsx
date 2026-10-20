import type { Metadata } from "next";

import { LegalPage, legalMetadata } from "@/features/legal/legal-page";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/privacy">): Promise<Metadata> {
  return legalMetadata("Privacy", (await params).locale);
}

export default function PrivacyPage() {
  return <LegalPage namespace="Privacy" />;
}
