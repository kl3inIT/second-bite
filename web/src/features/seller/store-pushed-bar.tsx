"use client";

import { useTranslations } from "next-intl";

import { TopBarView } from "@/components/top-bar";
import { usePathname } from "@/i18n/navigation";

// The top bar of a store's pushed screen on a phone (the dish form, Figma "Thêm món" and "Sửa món"): its name and
// a way back to the catalog. The layout shows it only while a pushed screen is open.
export function StorePushedBar() {
  const t = useTranslations("DishForm");
  const bar = useTranslations("TopBar");
  const pathname = usePathname();
  const catalog = pathname.split("/").slice(0, 4).join("/");

  return (
    <div className="hidden group-has-[[data-pushed]]/store:max-md:block">
      <TopBarView
        title={pathname.endsWith("/new") ? t("addTitle") : t("editTitle")}
        back={catalog}
        backLabel={bar("back")}
        homeLabel={bar("home")}
      />
    </div>
  );
}
