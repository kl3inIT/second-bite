import { BanIcon, CircleCheckIcon, EyeOffIcon, UsersIcon } from "lucide-react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { formatPrice } from "@/features/offers/format";
import { EmptyState } from "@/features/admin/ui/empty-state";
import { StatusCard, type StatusLine } from "@/features/admin/ui/status-card";
import { Link } from "@/i18n/navigation";
import type { OfferBody, SellerBody } from "@/lib/api/generated";

import { type AdminMember, AwaitingSignInBadge, MemberAvatar, RoleBadge } from "./member";
import { hasOwner, type SellerReview } from "./review";
import { postsIn } from "./seller-posts";

/** How many posts on sale the overview shows; "Xem tất cả" opens the rest. */
const SHOWN = 3;

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
  const status = review && statusCard(seller.status, review, hasOwner(members), t);

  return (
    <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-3">
      <div className="flex min-w-0 flex-col gap-5 lg:col-span-2">
        {peopleFirst && people}
        <Card
          title={t("overview.onSale")}
          action={
            onSale.length > 0 && (
              <Link
                href={postsHref}
                className="rounded-sm text-body-sm-strong text-primary hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                {t("overview.seeAll")}
              </Link>
            )
          }
        >
          {onSale.length === 0 ? (
            <EmptyState title={t("overview.noneOnSale")} />
          ) : (
            <ul className="flex flex-col">
              {onSale.slice(0, SHOWN).map((offer) => (
                <OfferRow key={offer.id} offer={offer} />
              ))}
            </ul>
          )}
        </Card>
        {blocked && people}
      </div>
      <div className="flex min-w-0 flex-col gap-5">
        {status ? (
          <StatusCard title={status.title} tone="error" lines={status.lines} />
        ) : (
          blocked && (
            <StatusCard
              title={t("blocked.title")}
              tone="error"
              lines={[
                { icon: BanIcon, text: t("blocked.noPosting") },
                { icon: EyeOffIcon, text: t("blocked.hidden") },
                { icon: CircleCheckIcon, text: t("blocked.kept"), tone: "success" },
              ]}
            />
          )
        )}
        <Card title={t("overview.info")}>
          <dl className="flex flex-col gap-3">
            <Field label={t("overview.address")} value={seller.address} />
            <Field label={t("overview.phone")} value={seller.phone} />
            {seller.statusChangedAt && (
              <Field
                label={t("overview.statusChanged")}
                value={`${format.dateTime(new Date(seller.statusChangedAt), "time")}, ${format.dateTime(new Date(seller.statusChangedAt), "day")}`}
              />
            )}
          </dl>
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
        { icon: CircleCheckIcon, text: t("rejected.retry"), tone: "success" },
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
        {
          icon: CircleCheckIcon,
          text: owned ? t("blocked.kept") : t("blocked.postsKept"),
          tone: "success",
        },
      ],
    };
  }
  return undefined;
}

// A white card with its title and, on the right, what it links to (Figma "Card · Bài đang bán").
function Card({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-border bg-card px-6 pt-5 pb-5.5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-title-lg text-foreground">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
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
    <li className="flex items-center gap-3.5 border-border py-3 not-first:border-t">
      <span className="relative size-20 shrink-0 overflow-hidden rounded-md bg-muted md:size-25">
        <Image
          src={`/api${offer.photo.smallPath}`}
          alt=""
          fill
          sizes="100px"
          unoptimized
          className="object-cover"
        />
      </span>
      <div className="flex min-w-0 flex-col gap-1.5">
        <h3 className="truncate text-title-lg text-foreground">{offer.name}</h3>
        <div className="flex flex-col gap-0.5">
          <p className="flex items-baseline gap-1.5">
            <span className="font-display text-price text-primary">
              {formatPrice(offer.priceVnd)}
            </span>
            <s className="text-label text-muted-foreground">
              {formatPrice(offer.originalPriceVnd)}
            </s>
          </p>
          <p className="text-label-strong text-destructive">
            {t("discount", {
              percent: offer.discountPercent,
              left: offer.unitsLeft,
              units: offer.units,
              unit: offer.unit,
            })}
          </p>
        </div>
        <p className="text-body-sm text-muted-foreground">
          {t("pickup", { from: time(offer.windowStart), until: time(offer.windowEnd) })}
        </p>
      </div>
    </li>
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
  if (empty && members.length === 0) {
    return (
      <Card title={title}>
        <EmptyState title={empty} icon={UsersIcon} />
      </Card>
    );
  }
  return (
    <Card title={title}>
      <ul className="flex flex-col gap-3.5">
        {members.map((member) => (
          <li key={member.accountId} className="flex items-center gap-3">
            <MemberAvatar member={member} />
            <span className="min-w-0 flex-1 truncate text-body-sm text-foreground">
              {member.email}
            </span>
            <AwaitingSignInBadge member={member} />
            <RoleBadge role={member.role} />
          </li>
        ))}
      </ul>
    </Card>
  );
}
