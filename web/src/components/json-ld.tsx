import { jsonLd } from "@/lib/seo";

// Structured data for search and answer engines: a plain script, not next/script, since it is data and runs
// nothing (the Next.js JSON-LD guide).
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />;
}
