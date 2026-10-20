import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * A white card of facts with its title (Figma AD-DH3 › Card · Khách, AD-HT2 › Card · Đối chiếu SePay). On a page
 * it is the larger card (20px corners, 24px sides); in a side sheet the smaller one (16px all round). `action`
 * sits at the right of the title, such as "Xem bài đăng".
 */
export function DetailCard({
  title,
  action,
  size = "page",
  children,
}: {
  title: string;
  action?: ReactNode;
  size?: "page" | "sheet";
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "flex min-w-0 flex-col border border-border bg-card",
        size === "page" ? "gap-3 rounded-2xl px-6 pt-5 pb-5.5" : "gap-2.5 rounded-xl p-4",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h2
          className={
            size === "page" ? "text-title-lg text-foreground" : "text-title text-foreground"
          }
        >
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export type DetailFact = { key: string; label: string; value: ReactNode };

/** Facts as name and value on one line each, the value strong at the right (Figma "Field · …", "KV · …"). */
export function DetailList({ facts }: { facts: DetailFact[] }) {
  return (
    <dl className="flex flex-col gap-3">
      {facts.map((fact) => (
        <div key={fact.key} className="flex items-start justify-between gap-3">
          <dt className="shrink-0 text-body-sm text-muted-foreground">{fact.label}</dt>
          <dd className="min-w-0 text-right text-body-sm-strong break-words text-foreground">
            {fact.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
