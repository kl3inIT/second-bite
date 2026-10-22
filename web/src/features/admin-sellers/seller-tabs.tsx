"use client";

import { parseAsStringLiteral, useQueryState } from "nuqs";
import { useTranslations } from "next-intl";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = ["overview", "posts", "members", "orders"] as const;

// A tab pressed with the pointer does not take focus, so Chrome does not ring it when a key such as Shift is
// pressed next; the keyboard still moves focus between the tabs and rings them.
const keepFocus = (event: React.MouseEvent) => event.preventDefault();

/** The tab open on a store's page, kept in the address so "Xem tất cả" is a link to the posts. */
export const sellerTab = parseAsStringLiteral(tabs).withDefault("overview");

/**
 * A store's page under its header (Figma AD-Q3): Tổng quan, Bài đăng and Thành viên with their counts. The
 * server renders each tab's content; this only switches between them.
 */
export function SellerTabs({
  posts,
  members,
  orders,
  overview,
  postsList,
  membersList,
  ordersList,
}: {
  posts: number;
  members: number;
  /** The orders of the day the orders tab shows. */
  orders: number;
  overview: React.ReactNode;
  postsList: React.ReactNode;
  membersList: React.ReactNode;
  ordersList: React.ReactNode;
}) {
  const t = useTranslations("Admin.sellers.detail");
  const [tab, setTab] = useQueryState("tab", sellerTab);

  return (
    <Tabs
      className="flex-1"
      value={tab}
      onValueChange={(next) => void setTab(next === "overview" ? null : next)}
    >
      <TabsList variant="line" aria-label={t("tabs")}>
        <TabsTrigger value="overview" className="min-h-11 flex-none" onMouseDown={keepFocus}>
          {t("overview")}
        </TabsTrigger>
        <TabsTrigger value="posts" className="min-h-11 flex-none" onMouseDown={keepFocus}>
          {t("posts", { count: posts })}
        </TabsTrigger>
        <TabsTrigger value="members" className="min-h-11 flex-none" onMouseDown={keepFocus}>
          {t("members", { count: members })}
        </TabsTrigger>
        <TabsTrigger value="orders" className="min-h-11 flex-none" onMouseDown={keepFocus}>
          {t("orders", { count: orders })}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="mt-5 flex flex-col">
        {overview}
      </TabsContent>
      <TabsContent value="posts" className="mt-5">
        {postsList}
      </TabsContent>
      <TabsContent value="orders" className="mt-5">
        {ordersList}
      </TabsContent>
      <TabsContent value="members" className="mt-5">
        {membersList}
      </TabsContent>
    </Tabs>
  );
}
