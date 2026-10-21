"use client";

import { useTranslations } from "next-intl";

import { TopBarView } from "@/components/top-bar";
import { usePathname } from "@/i18n/navigation";

// The top bar of a store's pushed screen on a phone (the dish form, Figma "Thêm món" and "Sửa món"; an order's
// own page, O2 and O3): its name and a way back to the catalog, or to the orders. The layout shows it only while a
// pushed screen is open.
export function StorePushedBar() {
  const t = useTranslations("DishForm");
  const order = useTranslations("StoreOrders.detail");
  const bar = useTranslations("TopBar");
  const pathname = usePathname();
  const parent = pathname.split("/").slice(0, 4).join("/");
  const ofOrder = pathname.includes("/orders/");
  let title = pathname.endsWith("/new") ? t("addTitle") : t("editTitle");
  if (ofOrder) title = order("pushedTitle");

  return (
    <div className="hidden group-has-[[data-pushed]]/store:max-md:block">
      <TopBarView title={title} back={parent} backLabel={bar("back")} homeLabel={bar("home")} />
    </div>
  );
}
