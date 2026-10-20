import { getTranslations } from "next-intl/server";

import { requireStore } from "./require-store";

// A tab of the store whose backend is not built yet (Figma Q3 the catalog, Q4 the orders): its name and a line
// that says so, until SEC-55 and SEC-15 give it its content. It reads the session, so it renders inside Suspense.
export async function StoreSoon({
  sellerId: pendingId,
  tab,
}: {
  sellerId: Promise<string>;
  tab: "catalog" | "orders";
}) {
  const sellerId = await pendingId;
  const [t] = await Promise.all([
    getTranslations("StoreSoon"),
    requireStore(sellerId, `/stores/${sellerId}/${tab}`),
  ]);

  return (
    <>
      <h1 className="text-page-title text-foreground">{t(`${tab}.title`)}</h1>
      <section className="flex flex-col gap-1 rounded-2xl border border-border bg-card p-5 text-card-foreground">
        <h2 className="text-title-lg">{t("soon")}</h2>
        <p className="text-body-sm text-muted-foreground">{t(`${tab}.body`)}</p>
      </section>
    </>
  );
}
