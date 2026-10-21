import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { StoreMap } from "@/components/map/store-map";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { AdminTopBar } from "@/features/admin/admin-top-bar";
import { OfferRow } from "@/features/admin-sellers/offer-row";
import { SellerPosts } from "@/features/admin-sellers/seller-posts";
import { SellerTabs } from "@/features/admin-sellers/seller-tabs";
import { shownPhone, StatusBadge, StoreThumb } from "@/features/admin-sellers/seller-parts";
import { StoreActions } from "@/features/admin-sellers/store-actions";
import { requireAdmin } from "@/features/identity/current-account";
import { sessionHeaders } from "@/features/identity/session";
import { Link } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import {
  getSeller,
  listSellerMembers,
  listSellerOffers,
  type MemberBody,
  type OfferBody,
} from "@/lib/api/generated";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Admin.sellers");
  return { title: t("title") };
}

/** A member's initials from the address: "chu.quan@…" is CQ. */
function initialsOf(email: string) {
  const words = email
    .split("@")[0]!
    .split(/[._-]+/)
    .filter(Boolean);
  return words
    .slice(0, 2)
    .map((w) => w[0]!)
    .join("")
    .toLocaleUpperCase("vi");
}

// A store's page for an admin (Figma AD-Q3, AD-Q4, SEC-62): the photos of its latest posts, its name and status
// with every action on it behind its "⋯", the same menu as the list's, then its overview, posts and members.
export default async function SellerPage({
  params,
}: PageProps<"/[locale]/admin/sellers/[sellerId]">) {
  const { sellerId } = await params;
  await requireAdmin(`/admin/sellers/${sellerId}`);
  const [t, headers] = await Promise.all([getTranslations("Admin"), sessionHeaders()]);

  let read;
  try {
    read = await Promise.all([
      getSeller({ headers, path: { sellerId } }),
      listSellerMembers({ headers, path: { sellerId } }),
      listSellerOffers({ headers, path: { sellerId }, query: { limit: 100 } }),
    ]);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 400 || error.status === 404)) notFound();
    throw error;
  }
  const [{ data: seller }, { data: people }, { data: posted }] = read;
  const members: MemberBody[] = people.members ?? [];
  const offers: OfferBody[] = posted.offers ?? [];
  const onSale = offers.filter((o) => o.status === "on_sale");
  const blocked = seller.status === "blocked";
  // The cover: the photos of the three latest posts, each sharing the width; with no post yet, the store's own
  // photo across the whole cover; with neither, the plain ground.
  const covers =
    offers.length > 0
      ? offers.slice(0, 3).map((offer) => `/api${offer.photo.largePath}`)
      : seller.photoId
        ? [`/api/photos/${seller.photoId}/1600.jpg`]
        : [];

  return (
    <>
      <AdminTopBar
        crumbs={[
          { label: t("group.operations") },
          { label: t("sellers.title"), href: "/admin/sellers" },
          { label: seller.name },
        ]}
      />
      <div className="flex flex-1 flex-col gap-5 px-4 py-6 md:px-8">
        <div
          className={cn("flex h-40 overflow-hidden rounded-2xl bg-muted", blocked && "opacity-50")}
        >
          {covers.map((src) => (
            <span key={src} className="relative flex-1">
              <Image
                src={src}
                alt=""
                fill
                sizes="(min-width: 1024px) 66vw, 100vw"
                unoptimized
                className="object-cover"
              />
            </span>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StoreThumb seller={seller} large />
          <h1 className="text-headline text-foreground">{seller.name}</h1>
          <StatusBadge status={seller.status} />
          <div className="ms-auto">
            <StoreActions seller={seller} onPage />
          </div>
        </div>
        <SellerTabs
          posts={offers.length}
          members={members.length}
          overview={
            <div className="grid flex-1 gap-5 lg:grid-cols-3">
              <Card size="lg" className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>{t("sellers.detail.onSale")}</CardTitle>
                  <CardAction>
                    <Link
                      href={`/admin/sellers/${seller.id}?tab=posts`}
                      className="text-label-strong text-link hover:underline"
                    >
                      {t("sellers.detail.seeAll")}
                    </Link>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  {onSale.length === 0 ? (
                    <p className="text-body-sm text-muted-foreground">
                      {t("sellers.detail.noneOnSale")}
                    </p>
                  ) : (
                    <ul className="grid gap-4 md:grid-cols-2">
                      {onSale.map((offer) => (
                        <OfferRow key={offer.id} offer={offer} />
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
              <div className="flex flex-col gap-5">
                <Card size="lg">
                  <CardHeader>
                    <CardTitle>{t("sellers.detail.info")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      <dl className="flex flex-col gap-2 text-body-sm">
                        <div className="flex justify-between gap-4">
                          <dt className="text-muted-foreground">{t("sellers.detail.address")}</dt>
                          <dd className="text-end text-body-sm-strong">{seller.address}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                          <dt className="text-muted-foreground">{t("sellers.detail.phone")}</dt>
                          <dd className="text-end text-body-sm-strong">
                            {shownPhone(seller.phone)}
                          </dd>
                        </div>
                      </dl>
                      {/* Where the owner pinned the store (SEC-66), so a wrong pin is seen before customers walk to it. */}
                      <StoreMap point={seller} label={t("sellers.detail.map")} />
                    </div>
                  </CardContent>
                </Card>
                <Card size="lg" className="flex-1">
                  <CardHeader>
                    <CardTitle>{t("sellers.detail.people")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Members
                      members={members}
                      owner={t("sellers.detail.owner")}
                      staff={t("sellers.detail.staff")}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          }
          postsList={
            offers.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>{t("sellers.detail.noPosts")}</EmptyTitle>
                </EmptyHeader>
              </Empty>
            ) : (
              <SellerPosts offers={offers} />
            )
          }
          membersList={
            <Card size="lg">
              <CardContent>
                <Members
                  members={members}
                  owner={t("sellers.detail.owner")}
                  staff={t("sellers.detail.staff")}
                />
              </CardContent>
            </Card>
          }
        />
      </div>
    </>
  );
}

function Members({
  members,
  owner,
  staff,
}: {
  members: MemberBody[];
  owner: string;
  staff: string;
}) {
  return (
    <ul className="flex flex-col gap-3">
      {members.map((member) => (
        <li key={member.accountId} className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback tone={member.role === "owner" ? "indigo" : "muted"}>
              {initialsOf(member.email)}
            </AvatarFallback>
          </Avatar>
          <span className="min-w-0 flex-1 truncate text-body-sm">{member.email}</span>
          <Badge variant={member.role === "owner" ? "info" : "neutral"}>
            {member.role === "owner" ? owner : staff}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
