import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminCrumb, AdminTopBarActions } from "@/features/admin/admin-crumbs";
import { isFeatureOn } from "@/features/admin/features";
import { adminHref } from "@/features/admin/pages";
import { Link } from "@/i18n/navigation";

import { listSellerDocuments } from "./documents-source";
import { DuplicateAlert } from "./duplicate-alert";
import { hasOwner, type SellerReview } from "./review";
import { SellerDocuments } from "./seller-documents";
import { SellerHeader } from "./seller-header";
import { neighboursOf } from "./seller-list";
import { SellerMembers } from "./seller-members";
import { SellerOverview } from "./seller-overview";
import { countPosts, coverPhotos } from "./seller-posts";
import { SellerPosts } from "./seller-posts-tab";
import { listSiblings, readSeller, readSellerMembers, readSellerOffers } from "./sellers-source";

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
  // What reviewing a store adds (SEC-64, SEC-65) shows only behind its flag: the reason an admin gave when
  // rejecting or blocking it. Who blocked it and a blocked store it matches are not given by the backend yet.
  const reviewing = isFeatureOn("storeReview");
  const review: SellerReview | undefined = reviewing ? { reason: seller.statusReason } : undefined;
  const [offers, members, siblings, documents, t, format] = await Promise.all([
    readSellerOffers(sellerId),
    readSellerMembers(sellerId),
    listSiblings(seller.status),
    listSellerDocuments(sellerId),
    getTranslations("admin.sellers.detail"),
    getFormatter(),
  ]);
  const tab: Tab = tabs.find((each) => each === search.tab) ?? "overview";
  const counts = countPosts(offers);
  const href = adminHref("sellerDetail", { sellerId });
  const day = (at: string) => format.dateTime(new Date(at), "day");
  const figures = [
    { label: t("info.posts"), value: counts.on_sale },
    { label: t("info.staff"), value: members.length },
    { label: t("info.joined"), value: day(seller.createdAt) },
    { label: t("info.changed"), value: day(seller.updatedAt) },
  ];
  const { previous, next, position, total } = neighboursOf(siblings, sellerId);

  return (
    <>
      <AdminCrumb label={seller.name} />
      {position > 0 && (
        <AdminTopBarActions>
          {/* The ‹ 1 / 5 › on the right of the top bar (Figma Admin/TopBar `pager`). */}
          <div className="flex items-center gap-3">
            <Step sellerId={previous} label={t("pager.previous")} icon={ChevronLeftIcon} />
            <span className="text-body-sm text-muted-foreground tabular-nums">
              {t("pager.position", { position, total })}
            </span>
            <Step sellerId={next} label={t("pager.next")} icon={ChevronRightIcon} />
          </div>
        </AdminTopBarActions>
      )}

      <SellerHeader
        seller={seller}
        cover={coverPhotos(offers)}
        review={reviewing}
        ownerless={!hasOwner(members)}
      />
      {/* The figures under the header (Figma Admin/InfoStrip): each value over its name; two by two on a phone. */}
      <Card size="sm">
        <CardContent>
          <dl className="grid grid-cols-2 gap-y-3 md:grid-cols-4">
            {figures.map(({ label, value }) => (
              <div key={label} className="flex flex-col-reverse items-center gap-0.5 text-center">
                <dt className="text-label text-muted-foreground">{label}</dt>
                <dd className="font-display text-price-lg text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
      {review?.duplicate && seller.status === "pending" && (
        <DuplicateAlert duplicate={review.duplicate} />
      )}
      {/* Each tab is an address (`?tab=posts`), so a tab can be shared and the back button returns to it. */}
      <Tabs value={tab}>
        <TabsList
          variant="line"
          aria-label={t("tabs.label")}
          className="max-w-full overflow-x-auto"
        >
          {[
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
          ].map((each) => (
            <TabsTrigger
              key={each.key}
              value={each.key}
              nativeButton={false}
              render={<Link href={each.href} scroll={false} />}
            >
              {each.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={tab}>
          <div className="flex flex-col gap-5 pt-3">
            {tab === "overview" && (
              <SellerOverview
                seller={seller}
                offers={offers}
                members={members}
                postsHref={`${href}?tab=posts`}
                review={review}
              />
            )}
            {tab === "posts" && <SellerPosts offers={offers} />}
            {tab === "members" && <SellerMembers members={members} />}
            {tab === "documents" && <SellerDocuments documents={documents} />}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}

// One step of the pager: a link to the store before or after, or a disabled button at the list's end.
function Step({
  sellerId,
  label,
  icon: Icon,
}: {
  sellerId?: string;
  label: string;
  icon: typeof ChevronLeftIcon;
}) {
  if (!sellerId) {
    return (
      <Button variant="outline" size="icon" disabled aria-label={label}>
        <Icon aria-hidden />
      </Button>
    );
  }
  return (
    <Link
      href={adminHref("sellerDetail", { sellerId })}
      aria-label={label}
      className={buttonVariants({ variant: "outline", size: "icon" })}
    >
      <Icon aria-hidden />
    </Link>
  );
}
