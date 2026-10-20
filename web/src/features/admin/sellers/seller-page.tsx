import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { AdminCrumb, AdminTopBarActions } from "@/features/admin/admin-crumbs";
import { adminHref } from "@/features/admin/pages";
import { InfoStrip } from "@/features/admin/ui/info-strip";
import { AdminTabs } from "@/features/admin/ui/tabs";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { listSellerDocuments } from "./documents-source";
import { SellerDocuments } from "./seller-documents";
import { SellerHeader } from "./seller-header";
import { neighboursOf } from "./seller-list";
import { SellerMembers } from "./seller-members";
import { SellerOverview } from "./seller-overview";
import { countPosts, coverPhotos } from "./seller-posts";
import { SellerPosts } from "./seller-posts-tab";
import { listSellers, readSeller, readSellerMembers, readSellerOffers } from "./sellers-source";

const tabs = ["overview", "posts", "members", "documents"] as const;
type Tab = (typeof tabs)[number];

/**
 * A store's page (Figma AD-Q3, AD-Q4, AD-QD1 to AD-QD5): its name at the end of the breadcrumb, ‹ › to the store
 * before and after it in its status's list, the profile header with its status action, the figures, and the tab
 * the address names. A store that does not exist is the admin's not-found page (`SELLER_NOT_FOUND`).
 */
export async function SellerPage({
  params,
  query,
}: {
  params: Promise<{ sellerId: string }>;
  query: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ sellerId }, search] = await Promise.all([params, query]);
  const seller = await readSeller(sellerId);
  const [offers, members, siblings, documents, t, format] = await Promise.all([
    readSellerOffers(sellerId),
    readSellerMembers(sellerId),
    listSellers(seller.status),
    listSellerDocuments(sellerId),
    getTranslations("admin.sellers.detail"),
    getFormatter(),
  ]);
  const tab: Tab = tabs.find((each) => each === search.tab) ?? "overview";
  const counts = countPosts(offers);
  const href = adminHref("sellerDetail", { sellerId });
  const day = (at: string) => format.dateTime(new Date(at), "day");

  return (
    <>
      <AdminCrumb label={seller.name} />
      <AdminTopBarActions>
        <Pager
          {...neighboursOf(siblings, sellerId)}
          labels={{ previous: t("pager.previous"), next: t("pager.next") }}
          say={(position, total) => t("pager.position", { position, total })}
        />
      </AdminTopBarActions>

      <SellerHeader seller={seller} cover={coverPhotos(offers)} />
      <InfoStrip
        items={[
          { label: t("info.posts"), value: counts.on_sale },
          { label: t("info.staff"), value: members.length },
          { label: t("info.joined"), value: day(seller.createdAt) },
          { label: t("info.changed"), value: day(seller.updatedAt) },
        ]}
      />
      <AdminTabs
        label={t("tabs.label")}
        current={tab}
        tabs={[
          { key: "overview", label: t("tabs.overview"), href },
          {
            key: "posts",
            label: t("tabs.posts", { count: offers.length }),
            href: `${href}?tab=posts`,
          },
          {
            key: "members",
            label: t("tabs.members", { count: members.length }),
            href: `${href}?tab=members`,
          },
          { key: "documents", label: t("tabs.documents"), href: `${href}?tab=documents` },
        ]}
      />

      {tab === "overview" && (
        <SellerOverview
          seller={seller}
          offers={offers}
          members={members}
          postsHref={`${href}?tab=posts`}
        />
      )}
      {tab === "posts" && <SellerPosts offers={offers} />}
      {tab === "members" && <SellerMembers members={members} />}
      {tab === "documents" && <SellerDocuments documents={documents} />}
    </>
  );
}

// The ‹ 1 / 5 › on the right of the top bar (Figma Admin/TopBar `pager`).
function Pager({
  previous,
  next,
  position,
  total,
  labels,
  say,
}: ReturnType<typeof neighboursOf> & {
  labels: { previous: string; next: string };
  say: (position: number, total: number) => string;
}) {
  if (position === 0) return null;
  const step = (sellerId: string | undefined, label: string, Icon: typeof ChevronLeftIcon) => {
    const className = buttonVariants({ variant: "neutral", size: "icon" });
    return sellerId ? (
      <Link href={adminHref("sellerDetail", { sellerId })} aria-label={label} className={className}>
        <Icon aria-hidden />
      </Link>
    ) : (
      <span aria-disabled="true" className={cn(className, "opacity-40")}>
        <span className="sr-only">{label}</span>
        <Icon aria-hidden />
      </span>
    );
  };
  return (
    <div className="flex items-center gap-3">
      {step(previous, labels.previous, ChevronLeftIcon)}
      <span className="text-body-sm text-muted-foreground tabular-nums">
        {say(position, total)}
      </span>
      {step(next, labels.next, ChevronRightIcon)}
    </div>
  );
}
