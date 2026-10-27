"use client";

import { useTranslations } from "next-intl";

import { TopBarView } from "@/components/top-bar";
import { usePathname } from "@/i18n/navigation";

// The top bar of a store's pushed screen on a phone (the dish form, Figma "Thêm món" and "Sửa món"; an order's
// own page, O2 and O3; the store's location, SEC-66; its information, SEC-144; its people, SEC-162): its name and a way back to the
// catalog, to the orders, or to the store's home. The layout shows it only while a pushed screen is open.
export function StorePushedBar() {
  const t = useTranslations("DishForm");
  const order = useTranslations("StoreOrders.detail");
  const location = useTranslations("StoreLocationPage");
  const edit = useTranslations("StoreEditPage");
  const reviews = useTranslations("StoreReviews");
  const staff = useTranslations("StoreMenu");
  const bar = useTranslations("TopBar");
  const pathname = usePathname();
  // An order's chat draws its own blue bar with the customer's name (Figma Q7).
  if (pathname.endsWith("/chat")) return null;
  // The pages that come straight under the store go back to its home; those under a tab go back to that tab.
  const ofLocation = pathname.endsWith("/location");
  const ofStore = /^\/stores\/[^/]+\/edit$/.test(pathname);
  const ofReviews = /^\/stores\/[^/]+\/reviews$/.test(pathname);
  const ofStaff = /^\/stores\/[^/]+\/staff$/.test(pathname);
  const parent = pathname
    .split("/")
    .slice(0, ofLocation || ofStore || ofReviews || ofStaff ? 3 : 4)
    .join("/");
  const ofOrder = pathname.includes("/orders/");
  let title = pathname.endsWith("/new") ? t("addTitle") : t("editTitle");
  if (ofOrder) title = order("pushedTitle");
  if (ofLocation) title = location("title");
  if (ofStore) title = edit("title");
  if (ofReviews) title = reviews("title");
  if (ofStaff) title = staff("staff");

  return (
    <div className="hidden group-has-[[data-pushed]]/store:max-md:block">
      <TopBarView title={title} back={parent} backLabel={bar("back")} homeLabel={bar("home")} />
    </div>
  );
}
