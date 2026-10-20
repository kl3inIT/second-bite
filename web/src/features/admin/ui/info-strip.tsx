import type { ReactNode } from "react";

export type InfoItem = { label: string; value: ReactNode };

/**
 * A row of figures under a detail page's header (Figma Admin/InfoStrip 228:6201): each one's value in Bricolage
 * over its name ("2 · Bài đang bán", "20/10/2026 · Ngày tham gia"), split by hairlines. On a phone they sit two
 * by two. A store's, an order's and an account's detail use it.
 */
export function InfoStrip({ items }: { items: InfoItem[] }) {
  return (
    <dl className="grid grid-cols-2 gap-y-3 rounded-lg border border-border bg-card px-2 py-3 md:flex">
      {items.map(({ label, value }) => (
        <div
          key={label}
          className="flex flex-1 flex-col-reverse items-center gap-0.5 text-center md:border-l md:border-border md:first:border-l-0"
        >
          <dt className="text-label text-muted-foreground">{label}</dt>
          <dd className="font-display text-price-lg text-foreground">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
