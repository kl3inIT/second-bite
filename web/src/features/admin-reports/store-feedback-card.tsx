import { getFormatter, getTranslations } from "next-intl/server";

import type { FeedbackBody } from "@/lib/api/generated";

/**
 * What the stores told the team in the report's days and store (SEC-82, Figma AD-BC4), the latest first: the
 * store, when, and its words. It sits under the table of stores, so the numbers and what was said read together.
 */
export async function StoreFeedbackCard({ items }: { items: FeedbackBody[] }) {
  const [t, format] = await Promise.all([
    getTranslations("Admin.reports.feedback"),
    getFormatter(),
  ]);

  return (
    <section
      aria-labelledby="report-feedback"
      className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
    >
      <h2 id="report-feedback" className="text-title-lg text-foreground">
        {t("title")} ·{" "}
        <span className="text-muted-foreground">{t("count", { count: items.length })}</span>
      </h2>
      {items.length === 0 ? (
        <p className="text-body-sm text-muted-foreground">{t("empty")}</p>
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {items.map((item) => {
            const sent = new Date(item.sentAt);
            return (
              <li key={item.id} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0">
                <p className="text-body-sm-strong text-foreground">
                  {item.sellerName}
                  <span className="font-normal text-muted-foreground">
                    {" · "}
                    {t("when", {
                      date: format.dateTime(sent, { day: "2-digit", month: "2-digit" }),
                      time: format.dateTime(sent, "time"),
                    })}
                  </span>
                </p>
                <p className="text-body-sm break-words whitespace-pre-line text-foreground">
                  {item.text}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
