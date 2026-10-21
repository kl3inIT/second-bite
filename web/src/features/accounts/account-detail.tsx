import {
  BanIcon,
  CircleCheckIcon,
  CircleXIcon,
  ClockIcon,
  TriangleAlertIcon,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/features/offers/format";
import type { HistoryOutputBody, MembershipBody, OrderBody, RecordBody } from "@/lib/api/generated";

import { AccountAvatar, nameOf, RoleBadge } from "./account-parts";
import { linesOf, outcomeOf, pickupRate, type OrderOutcome } from "./order-outcome";

// Each outcome's chip: a tone and an icon, never colour alone (Figma AD-TK2 › Đơn gần đây).
const outcomeLook: Record<
  OrderOutcome,
  { variant: "info" | "success" | "warning" | "neutral" | "danger"; icon: LucideIcon }
> = {
  open: { variant: "info", icon: ClockIcon },
  collected: { variant: "success", icon: CircleCheckIcon },
  missed: { variant: "warning", icon: TriangleAlertIcon },
  cancelled: { variant: "neutral", icon: CircleXIcon },
  refused: { variant: "danger", icon: BanIcon },
};

/**
 * One account (Figma AD-TK2, as SEC-75 proposes it): who it is, four figures, its latest orders, how it signs
 * in and the stores it belongs to. Each part is read from its own module: identity, order, seller.
 */
export function AccountDetail({
  account,
  history,
  memberships,
}: {
  account: RecordBody;
  history: HistoryOutputBody;
  memberships: MembershipBody[];
}) {
  const t = useTranslations("Admin.accounts");
  const format = useFormatter();
  const rate = pickupRate(history.collected, history.missed);
  const at = (iso: string) => {
    const date = new Date(iso);
    return `${format.dateTime(date, "day")} · ${format.dateTime(date, "time")}`;
  };

  const figures = [
    { label: t("figure.placed"), value: String(history.placed) },
    { label: t("figure.pickupRate"), value: rate === undefined ? "—" : `${rate}%` },
    { label: t("figure.joined"), value: format.dateTime(new Date(account.createdAt), "day") },
    {
      label: t("figure.signedIn"),
      value: account.lastSignedInAt ? at(account.lastSignedInAt) : t("neverSignedIn"),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <Card size="lg">
        <CardContent>
          <div className="flex items-center gap-4">
            <AccountAvatar account={account} />
            <div className="flex min-w-0 flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-page-title break-all text-foreground">{nameOf(account)}</h1>
                <RoleBadge role={account.role} />
              </div>
              {account.displayName && (
                <p className="text-body-sm break-all text-muted-foreground">{account.email}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <dl className="grid grid-cols-2 gap-y-4 md:grid-cols-4 md:divide-x md:divide-border">
            {figures.map((figure) => (
              <div
                key={figure.label}
                className="flex flex-col-reverse items-center gap-1 px-3 text-center"
              >
                <dt className="text-label text-muted-foreground">{figure.label}</dt>
                <dd className="text-card-title text-foreground">{figure.value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card size="lg" className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("recent.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            {history.recent.length === 0 ? (
              <p className="text-body-sm text-muted-foreground">{t("recent.empty")}</p>
            ) : (
              <ul className="flex flex-col">
                {history.recent.map((order) => (
                  <RecentOrder key={order.id} order={order} />
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-5">
          <Card size="lg">
            <CardHeader>
              <CardTitle>{t("info.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="flex flex-col gap-3">
                <Fact label={t("info.method")}>
                  {account.lastSignInMethod ? t(`method.${account.lastSignInMethod}`) : "—"}
                </Fact>
                <Fact label={t("info.role")}>{t(`role.${account.role}`)}</Fact>
              </dl>
            </CardContent>
          </Card>

          <Card size="lg">
            <CardHeader>
              <CardTitle>{t("sellers.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              {memberships.length === 0 ? (
                <p className="text-body-sm text-muted-foreground">{t("sellers.empty")}</p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {memberships.map((m) => (
                    <li
                      key={m.sellerId}
                      className="flex flex-wrap items-center justify-between gap-2"
                    >
                      <span className="text-body-sm-strong text-foreground">{m.sellerName}</span>
                      <Badge variant={m.role === "owner" ? "info" : "neutral"}>
                        {t(`sellers.${m.role}`)}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-body-sm text-muted-foreground">{label}</dt>
      <dd className="text-body-sm-strong text-foreground">{children}</dd>
    </div>
  );
}

function RecentOrder({ order }: { order: OrderBody }) {
  const t = useTranslations("Admin.accounts.outcome");
  const outcome = outcomeOf(order);
  const { variant, icon: Icon } = outcomeLook[outcome];
  const [first] = order.lines;

  return (
    <li className="flex flex-wrap items-center gap-3 border-b border-border py-3 first:pt-0 last:border-b-0 last:pb-0">
      {first && (
        <span className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
          <Image
            src={`/api${first.photo.smallPath}`}
            alt=""
            fill
            sizes="40px"
            unoptimized
            className="object-cover"
          />
        </span>
      )}
      <p className="min-w-40 flex-1 text-body-sm text-foreground">
        <span className="text-body-sm-strong">{linesOf(order)}</span>
        <span className="text-muted-foreground"> · {order.seller.name}</span>
      </p>
      <span className="text-body-sm-strong whitespace-nowrap text-foreground">
        {formatPrice(order.totalVnd)}
      </span>
      <Badge variant={variant}>
        <Icon data-icon="inline-start" aria-hidden />
        {t(outcome)}
      </Badge>
    </li>
  );
}
