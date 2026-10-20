"use client";

import {
  BanIcon,
  CircleCheckIcon,
  CircleXIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ReceiptIcon,
  RotateCcwIcon,
} from "lucide-react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { type ReactNode, useState } from "react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/features/offers/format";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { AdminCrumb, AdminTopBarActions } from "../admin-crumbs";
import { adminHref } from "../pages";
import { InfoStrip } from "../ui/info-strip";
import { RowActionMenu } from "../ui/row-action-menu";
import { StatusCard } from "../ui/status-card";
import { AdminTabs } from "../ui/tabs";
import { type AccountDetailTab, type AdminAccount, detailTabs } from "./account";
import {
  AccountAvatar,
  AccountOrderBadge,
  AccountRoleBadge,
  AccountStatusBadge,
} from "./account-badges";
import { LockAccountDialog } from "./lock-account-dialog";

/**
 * One account (Figma AD-TK2, AD-TK4): its initials, name, status and role with its actions at the head; its
 * orders, pickup rate, reports and day joined in a strip; the tabs Đơn gần đây, Cửa hàng, Báo lỗi; on the right,
 * when locked, what that means, then how it signs in and the stores it belongs to. "Khoá tài khoản" asks first
 * (AD-TK3); unlocking waits for its backend.
 */
export function AccountDetail({ account, tab }: { account: AdminAccount; tab: AccountDetailTab }) {
  const t = useTranslations("admin.accounts");
  const format = useFormatter();
  const [locking, setLocking] = useState(false);
  const locked = account.status === "locked";
  const here = adminHref("accountDetail", { accountId: account.id });
  const counts: Record<AccountDetailTab, number> = {
    orders: account.orders,
    stores: account.sellers.length,
    issues: account.issues.length,
  };

  return (
    <>
      <AdminCrumb label={account.name} />
      {account.position && <Pager position={account.position} />}
      <section className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-6">
        <AccountAvatar name={account.name} size="page" />
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2.5">
          <h1 className="text-headline text-foreground">{account.name}</h1>
          <AccountStatusBadge status={account.status} />
          <AccountRoleBadge role={account.role} />
        </div>
        <div className="flex items-center gap-3">
          <RowActionMenu
            name={account.name}
            actions={[
              {
                label: t("detail.allOrders"),
                icon: ReceiptIcon,
                href: `${adminHref("orders")}?q=${encodeURIComponent(account.email)}`,
              },
            ]}
          />
          {locked ? (
            <span title={t("soon")} className="flex">
              <Button disabled>
                <RotateCcwIcon data-icon="inline-start" aria-hidden />
                {t("detail.unlock")}
              </Button>
            </span>
          ) : (
            <Button variant="destructive-outline" onClick={() => setLocking(true)}>
              <BanIcon data-icon="inline-start" aria-hidden />
              {t("detail.lock")}
            </Button>
          )}
        </div>
      </section>
      <InfoStrip
        items={[
          { label: t("detail.orders"), value: account.orders },
          {
            label: t("detail.pickupRate"),
            value:
              account.pickupRate === undefined
                ? "—"
                : format.number(account.pickupRate, { style: "percent" }),
          },
          { label: t("detail.issues"), value: account.issues.length },
          {
            label: t("detail.joined"),
            value: format.dateTime(new Date(account.createdAt), "day"),
          },
        ]}
      />
      <AdminTabs
        label={t("detail.tabs.label")}
        current={tab}
        tabs={detailTabs.map((key) => ({
          key,
          label: t(`detail.tabs.${key}`),
          href: key === "orders" ? here : `${here}?tab=${key}`,
          count: counts[key],
        }))}
      />
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          {tab === "orders" && <RecentOrders account={account} />}
          {tab === "stores" && <Stores account={account} />}
          {tab === "issues" && <Issues account={account} />}
        </div>
        <div className="flex w-full shrink-0 flex-col gap-5 lg:w-90">
          {locked && (
            <StatusCard
              title={t("locked.title")}
              tone="error"
              lines={[
                { icon: BanIcon, text: t("locked.signIn") },
                { icon: CircleXIcon, text: t("locked.orders") },
                { icon: CircleCheckIcon, text: t("locked.history"), tone: "success" },
              ]}
            />
          )}
          <Card title={t("detail.info")}>
            <dl className="flex flex-col gap-3">
              <Fact term={t("detail.role")}>{t(`role.${account.role}`)}</Fact>
              <Fact term={t("detail.signIn")}>{t(`signIn.${account.signIn}`)}</Fact>
              {account.lastActiveAt && (
                <Fact term={t("detail.lastActive")}>
                  {format.dateTime(new Date(account.lastActiveAt), "time")},{" "}
                  {format.dateTime(new Date(account.lastActiveAt), "day")}
                </Fact>
              )}
            </dl>
          </Card>
          <Card title={t("detail.sellers")}>
            <SellerLinks account={account} />
          </Card>
        </div>
      </div>
      <LockAccountDialog
        name={account.name}
        heldOrders={account.heldOrders}
        open={locking}
        onOpenChange={setLocking}
      />
    </>
  );
}

/** ‹ 1 / 214 › in the top bar, to the account before and after in the list (Figma AD-TK2 › Pager). */
function Pager({ position }: { position: NonNullable<AdminAccount["position"]> }) {
  const t = useTranslations("admin.accounts.detail");
  const square =
    "flex size-11 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";
  const step = (id: string | undefined, label: string, icon: ReactNode) =>
    id ? (
      <Link
        href={adminHref("accountDetail", { accountId: id })}
        aria-label={label}
        className={square}
      >
        {icon}
      </Link>
    ) : (
      <span aria-disabled="true" className={cn(square, "opacity-40")}>
        <span className="sr-only">{label}</span>
        {icon}
      </span>
    );
  return (
    <AdminTopBarActions>
      {step(
        position.previousId,
        t("previous"),
        <ChevronLeftIcon aria-hidden className="size-4.5" />,
      )}
      <span className="text-body-sm text-muted-foreground tabular-nums">
        {t("position", { index: position.index, total: position.total })}
      </span>
      {step(position.nextId, t("next"), <ChevronRightIcon aria-hidden className="size-4.5" />)}
    </AdminTopBarActions>
  );
}

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

function Fact({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-body-sm text-muted-foreground">{term}</dt>
      <dd className="text-right text-body-sm-strong text-foreground">{children}</dd>
    </div>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return <p className="text-body-sm text-muted-foreground">{children}</p>;
}

const linkClass =
  "rounded-sm text-body-sm-strong text-primary hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";

function RecentOrders({ account }: { account: AdminAccount }) {
  const t = useTranslations("admin.accounts.detail");
  return (
    <Card
      title={t("tabs.orders")}
      action={
        account.orders > 0 && (
          <Link
            href={`${adminHref("orders")}?q=${encodeURIComponent(account.email)}`}
            className={linkClass}
          >
            {t("seeAll", { count: account.orders })}
          </Link>
        )
      }
    >
      {account.recentOrders.length === 0 ? (
        <Empty>{t("noOrders")}</Empty>
      ) : (
        <ul className="flex flex-col">
          {account.recentOrders.map((order) => (
            <li
              key={order.id}
              className="flex items-center gap-3 border-b border-border py-3.5 last:border-b-0"
            >
              {order.photoUrl ? (
                <Image
                  src={order.photoUrl}
                  alt=""
                  width={36}
                  height={36}
                  unoptimized
                  className="size-9 shrink-0 rounded-md object-cover"
                />
              ) : (
                <span aria-hidden className="size-9 shrink-0 rounded-md bg-muted" />
              )}
              <Link
                href={adminHref("orderDetail", { orderId: order.id })}
                className="min-w-0 flex-1 truncate rounded-sm text-body-sm-strong text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                {t("orderLine", { item: order.item, seller: order.sellerName })}
              </Link>
              <span className="shrink-0 text-body-sm-strong text-foreground tabular-nums">
                {formatPrice(order.amountVnd)}
              </span>
              <span className="flex w-28 shrink-0 justify-end">
                <AccountOrderBadge status={order.status} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function Stores({ account }: { account: AdminAccount }) {
  const t = useTranslations("admin.accounts.detail");
  return (
    <Card title={t("tabs.stores")}>
      <SellerLinks account={account} />
    </Card>
  );
}

function SellerLinks({ account }: { account: AdminAccount }) {
  const t = useTranslations("admin.accounts");
  if (account.sellers.length === 0) return <Empty>{t("detail.noSellers")}</Empty>;
  return (
    <ul className="flex flex-col gap-3">
      {account.sellers.map((seller) => (
        <li key={seller.id} className="flex items-center justify-between gap-3">
          <Link href={adminHref("sellerDetail", { sellerId: seller.id })} className={linkClass}>
            {seller.name}
          </Link>
          <AccountRoleBadge role={seller.role} />
        </li>
      ))}
    </ul>
  );
}

function Issues({ account }: { account: AdminAccount }) {
  const t = useTranslations("admin.accounts.detail");
  return (
    <Card title={t("tabs.issues")}>
      {account.issues.length === 0 ? (
        <Empty>{t("noIssues")}</Empty>
      ) : (
        <ul className="flex flex-col gap-3">
          {account.issues.map((issue) => (
            <li key={issue.id}>
              <Link href={adminHref("issueDetail", { issueId: issue.id })} className={linkClass}>
                {t("issueLine", { code: issue.code, title: issue.title })}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
