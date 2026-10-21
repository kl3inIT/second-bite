import {
  BanIcon,
  CircleCheckIcon,
  ClockIcon,
  EyeOffIcon,
  InboxIcon,
  type LucideIcon,
  UsersIcon,
} from "lucide-react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { formatPrice } from "@/features/offers/format";
import { Link } from "@/i18n/navigation";
import type { OfferBody, SellerBody } from "@/lib/api/generated";

import { type AdminMember, initialsOf, roleTone } from "./member";
import { hasOwner, type SellerReview } from "./review";
import { toneBadge } from "./seller-list";
import { postsIn } from "./seller-posts";

/** How many posts on sale the overview shows; "Xem tất cả" opens the rest. */
const SHOWN = 3;

type StatusLine = { icon: LucideIcon; text: string };

/**
 * A store's overview tab (Figma AD-Q3, AD-Q4): its posts on sale, then its details and its people. A blocked
 * store has the card "Cửa hàng đang bị chặn" at the head of the right column instead of a banner, with when its
 * status changed among the details, and its people move under the posts.
 *
 * With the `storeReview` flag (SEC-64, SEC-65) `review` holds what the backend says beyond the status: a rejected
 * store has its card "Cửa hàng bị từ chối" with the reason (AD-DS5), a blocked one says why and who blocked it, an
 * admin or its owner deleting their account (AD-DS6, AD-DS7), and a store being reviewed shows its people first
 * (AD-DS2). Without the flag `review` is absent and the tab is as it was.
 */
export function SellerOverview({
  seller,
  offers,
  members,
  postsHref,
  review,
}: {
  seller: SellerBody;
  offers: OfferBody[];
  members: AdminMember[];
  postsHref: string;
  review?: SellerReview;
}) {
  const t = useTranslations("admin.sellers.detail");
  const format = useFormatter();
  const blocked = seller.status === "blocked";
  const peopleFirst = review !== undefined && ["pending", "rejected"].includes(seller.status);
  const onSale = postsIn(offers, "on_sale");
  const people = (
    <MembersCard
      members={members}
      title={t("overview.members")}
      empty={review && t("overview.noMembers")}
    />
  );
  const status =
    (review && statusCard(seller.status, review, hasOwner(members), t)) ||
    (blocked
      ? {
          title: t("blocked.title"),
          lines: [
            { icon: BanIcon, text: t("blocked.noPosting") },
            { icon: EyeOffIcon, text: t("blocked.hidden") },
            { icon: CircleCheckIcon, text: t("blocked.kept") },
          ],
        }
      : undefined);

  return (
    <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-3">
      <div className="flex min-w-0 flex-col gap-5 lg:col-span-2">
        {peopleFirst && people}
        <Card>
          <CardHeader>
            <CardTitle>
              <h2>{t("overview.onSale")}</h2>
            </CardTitle>
            {onSale.length > 0 && (
              <CardAction>
                <Link
                  href={postsHref}
                  className={buttonVariants({ variant: "link", size: "inline" })}
                >
                  {t("overview.seeAll")}
                </Link>
              </CardAction>
            )}
          </CardHeader>
          <CardContent>
            {onSale.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <InboxIcon aria-hidden />
                  </EmptyMedia>
                  <EmptyTitle>{t("overview.noneOnSale")}</EmptyTitle>
                </EmptyHeader>
              </Empty>
            ) : (
              <ul className="flex flex-col gap-3">
                {onSale.slice(0, SHOWN).map((offer) => (
                  <li key={offer.id}>
                    <OfferRow offer={offer} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        {blocked && people}
      </div>
      <div className="flex min-w-0 flex-col gap-5">
        {status && (
          <Alert variant="destructive">
            <BanIcon aria-hidden />
            <AlertTitle>
              <h2>{status.title}</h2>
            </AlertTitle>
            <AlertDescription>
              <ul className="flex flex-col gap-2">
                {status.lines.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex gap-2 text-foreground">
                    <Icon aria-hidden className="mt-0.5 size-4 shrink-0" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        <Card>
          <CardHeader>
            <CardTitle>
              <h2>{t("overview.info")}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="flex flex-col gap-3">
              <Fact label={t("overview.address")} value={seller.address} />
              <Fact label={t("overview.phone")} value={seller.phone} />
              {seller.statusChangedAt && (
                <Fact
                  label={t("overview.statusChanged")}
                  value={`${format.dateTime(new Date(seller.statusChangedAt), "time")}, ${format.dateTime(new Date(seller.statusChangedAt), "day")}`}
                />
              )}
            </dl>
          </CardContent>
        </Card>
        {!blocked && !peopleFirst && people}
      </div>
    </div>
  );
}

type Words = ReturnType<typeof useTranslations<"admin.sellers.detail">>;

/**
 * The card at the head of the right column for a rejected or a blocked store, with the `storeReview` flag: the
 * reason first when the backend gives one, then what the status means. A store whose owner deleted their account
 * says so, and keeps its posts but no staff to speak of (AD-DS6).
 */
function statusCard(
  status: SellerBody["status"],
  review: SellerReview,
  owned: boolean,
  t: Words,
): { title: string; lines: StatusLine[] } | undefined {
  const reason: StatusLine | undefined = review.reason
    ? { icon: BanIcon, text: t("reason", { reason: review.reason }) }
    : undefined;
  if (status === "rejected") {
    return {
      title: t("rejected.title"),
      lines: [
        ...(reason ? [reason] : []),
        { icon: EyeOffIcon, text: t("rejected.hidden") },
        { icon: CircleCheckIcon, text: t("rejected.retry") },
      ],
    };
  }
  if (status === "blocked") {
    const why =
      review.blockedBy === "owner_deleted"
        ? { icon: BanIcon, text: t("blocked.ownerDeleted") }
        : (reason ?? { icon: BanIcon, text: t("blocked.noPosting") });
    return {
      title: t("blocked.title"),
      lines: [
        why,
        { icon: EyeOffIcon, text: t("blocked.hidden") },
        { icon: CircleCheckIcon, text: owned ? t("blocked.kept") : t("blocked.postsKept") },
      ],
    };
  }
  return undefined;
}

// One of the store's details: its name muted on the left, its value on the right.
function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="shrink-0 text-body-sm text-muted-foreground">{label}</dt>
      <dd className="text-right text-body-sm-strong text-foreground">{value}</dd>
    </div>
  );
}

// A post on sale (Figma Admin/OfferRow): its photo, its name, the price over the old one, how much off and how
// many are left, and when it is collected.
function OfferRow({ offer }: { offer: OfferBody }) {
  const t = useTranslations("admin.sellers.detail.overview");
  const format = useFormatter();
  const time = (at: string) => format.dateTime(new Date(at), "time");
  return (
    <Item variant="outline">
      <ItemMedia>
        <span className="relative size-20 overflow-hidden rounded-md bg-muted">
          <Image
            src={`/api${offer.photo.smallPath}`}
            alt=""
            fill
            sizes="80px"
            unoptimized
            className="object-cover"
          />
        </span>
      </ItemMedia>
      <ItemContent className="min-w-0">
        <ItemTitle>
          <h3 className="truncate text-title-lg text-foreground">{offer.name}</h3>
        </ItemTitle>
        <p className="flex items-baseline gap-1.5">
          <span className="font-display text-price text-primary">
            {formatPrice(offer.priceVnd)}
          </span>
          <s className="text-label text-muted-foreground">{formatPrice(offer.originalPriceVnd)}</s>
        </p>
        <p className="text-label-strong text-destructive">
          {t("discount", {
            percent: offer.discountPercent,
            left: offer.unitsLeft,
            units: offer.units,
            unit: offer.unit,
          })}
        </p>
        <p className="text-body-sm text-muted-foreground">
          {t("pickup", { from: time(offer.windowStart), until: time(offer.windowEnd) })}
        </p>
      </ItemContent>
    </Item>
  );
}

/** The store's people; `empty` says there is nobody left (AD-DS6), with the `storeReview` flag. */
function MembersCard({
  members,
  title,
  empty,
}: {
  members: AdminMember[];
  title: string;
  empty?: string;
}) {
  const t = useTranslations("admin.sellers.detail");
  let body: ReactNode;
  if (empty && members.length === 0) {
    body = (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <UsersIcon aria-hidden />
          </EmptyMedia>
          <EmptyTitle>{empty}</EmptyTitle>
        </EmptyHeader>
      </Empty>
    );
  } else {
    body = (
      <ul className="flex flex-col gap-2">
        {members.map((member) => (
          <li key={member.accountId}>
            <Item size="xs">
              <ItemMedia>
                <Avatar aria-hidden>
                  <AvatarFallback tone={member.role === "owner" ? "indigo" : "muted"}>
                    {initialsOf(member.email)}
                  </AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent className="min-w-0">
                <ItemTitle>{member.email}</ItemTitle>
              </ItemContent>
              <ItemActions>
                {member.awaitingSignIn && (
                  <Badge variant={toneBadge.neutral}>
                    <ClockIcon aria-hidden />
                    {t("members.awaitingSignIn")}
                  </Badge>
                )}
                <Badge variant={toneBadge[roleTone[member.role]]}>
                  {t(`roles.${member.role}`)}
                </Badge>
              </ItemActions>
            </Item>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>{title}</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>{body}</CardContent>
    </Card>
  );
}
