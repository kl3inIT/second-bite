import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { DishForm } from "./dish-form";
import { getStoreDishes } from "./my-sellers";
import { requireStore } from "./require-store";

// The page of one dish of the catalog (SEC-55, Figma Q3c "Thêm món" and C1 "Sửa món"): its name and the form,
// on a card. Without `dishId` it adds one; a dish that does not exist, or is another store's, is not found.
// It reads the session, so it renders inside Suspense.
export async function CatalogDish({
  sellerId: pendingId,
  dishId: pendingDish,
}: {
  sellerId: Promise<string>;
  dishId?: Promise<string>;
}) {
  const [sellerId, dishId] = await Promise.all([pendingId, pendingDish]);
  const [t] = await Promise.all([
    getTranslations("DishForm"),
    requireStore(sellerId, `/stores/${sellerId}/catalog${dishId ? `/${dishId}/edit` : "/new"}`),
  ]);
  const dish = dishId ? (await getStoreDishes(sellerId)).find((d) => d.id === dishId) : undefined;
  if (dishId && !dish) notFound();

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
      <h1 className="text-page-title text-foreground">{dish ? t("editTitle") : t("addTitle")}</h1>
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <DishForm sellerId={sellerId} dish={dish} />
      </div>
    </div>
  );
}
