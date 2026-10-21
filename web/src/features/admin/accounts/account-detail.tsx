"use client";

import {
  BanIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleCheckIcon,
  CircleXIcon,
  EllipsisIcon,
  PackageIcon,
  ReceiptIcon,
  RotateCcwIcon,
} from "lucide-react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatPrice } from "@/features/offers/format";
import { initials } from "@/features/offers/seller";
import { Link, useRouter } from "@/i18n/navigation";

import { AdminCrumb, AdminTopBarActions } from "../admin-crumbs";
import { adminHref } from "../pages";
import {
  type AccountDetailTab,
  type AdminAccount,
  detailTabs,
  orderLook,
  roleLook,
  statusLook,
} from "./account";
import { LockAccountDialog } from "./lock-account-dialog";

/**
 * One account (Figma AD-TK2, AD-TK4): its initials, name, status and role with its actions at the head; its
 * orders, pickup rate, reports and day joined in a strip; the tabs Đơn gần đây, Cửa hàng, Báo lỗi; on the right,
 * when locked, what that means, then how it signs in and the stores it belongs to. "Khoá tài khoản" asks first
 * (AD-TK3); unlocking waits for its backend.
 */
export function AccountDetail({ account, tab }: { account: AdminAccount; tab: AccountDetailTab }) {
  const t = useTranslations("admin.accounts");
  const shell = useTranslations("admin.shell");
  const format = useFormatter();
  const router = useRouter();
  const [locking, setLocking] = useState(false);
  const locked = account.status === "locked";
  const status = statusLook(account.status);
  const here = adminHref("accountDetail", { accountId: account.id });
  const orders = `${adminHref("orders")}?q=${encodeURIComponent(account.email)}`;
  const link = buttonVariants({ variant: "link", size: "inline" });
  const counts: Record<AccountDetailTab, number> = {
    orders: account.orders,
    stores: account.sellers.length,
    issues: account.issues.length,
  };
  const figures = [
    { label: t("detail.orders"), value: account.orders },
    {
      label: t("detail.pickupRate"),
      value:
        account.pickupRate === undefined
          ? "—"
          : format.number(account.pickupRate, { style: "percent" }),
    },
    { label: t("detail.issues"), value: account.issues.length },
    { label: t("detail.joined"), value: format.dateTime(new Date(account.createdAt), "day") },
  ];
  const facts = [
    { term: t("detail.role"), value: t(`role.${account.role}`) },
    { term: t("detail.signIn"), value: t(`signIn.${account.signIn}`) },
    ...(account.lastActiveAt
      ? [
          {
            term: t("detail.lastActive"),
            value: `${format.dateTime(new Date(account.lastActiveAt), "time")}, ${format.dateTime(new Date(account.lastActiveAt), "day")}`,
          },
        ]
      : []),
  ];
  const sellerLinks =
    account.sellers.length === 0 ? (
      <p className="text-body-sm text-muted-foreground">{t("detail.noSellers")}</p>
    ) : (
      <ul className="flex flex-col gap-3">
        {account.sellers.map((seller) => (
          <li key={seller.id} className="flex items-center justify-between gap-3">
            <Link href={adminHref("sellerDetail", { sellerId: seller.id })} className={link}>
              {seller.name}
            </Link>
            <Badge variant={roleLook(seller.role)}>{t(`role.${seller.role}`)}</Badge>
          </li>
        ))}
      </ul>
    );

  return (
    <>
      <AdminCrumb label={account.name} />
      {account.position && (
        // ‹ 1 / 214 › in the top bar, to the account before and after in the list (Figma AD-TK2 › Pager).
        <AdminTopBarActions>
          {account.position.previousId ? (
            <Link
              href={adminHref("accountDetail", { accountId: account.position.previousId })}
              aria-label={t("detail.previous")}
              className={buttonVariants({ variant: "outline", size: "icon" })}
            >
              <ChevronLeftIcon aria-hidden />
            </Link>
          ) : (
            <Button variant="outline" size="icon" disabled aria-label={t("detail.previous")}>
              <ChevronLeftIcon aria-hidden />
            </Button>
          )}
          <span className="text-body-sm text-muted-foreground tabular-nums">
            {t("detail.position", {
              index: account.position.index,
              total: account.position.total,
            })}
          </span>
          {account.position.nextId ? (
            <Link
              href={adminHref("accountDetail", { accountId: account.position.nextId })}
              aria-label={t("detail.next")}
              className={buttonVariants({ variant: "outline", size: "icon" })}
            >
              <ChevronRightIcon aria-hidden />
            </Link>
          ) : (
            <Button variant="outline" size="icon" disabled aria-label={t("detail.next")}>
              <ChevronRightIcon aria-hidden />
            </Button>
          )}
        </AdminTopBarActions>
      )}
      <Card>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <Avatar size="lg" aria-hidden>
              <AvatarFallback>{initials(account.name)}</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2.5">
              <h1 className="text-headline text-foreground">{account.name}</h1>
              <Badge variant={status.variant}>
                <status.icon aria-hidden />
                {t(`status.${account.status}`)}
              </Badge>
              <Badge variant={roleLook(account.role)}>{t(`role.${account.role}`)}</Badge>
            </div>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<Button variant="ghost" size="icon" />}
                  aria-label={shell("rowActions", { name: account.name })}
                >
                  <EllipsisIcon aria-hidden />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuItem render={<Link href={orders} />}>
                      <ReceiptIcon aria-hidden />
                      {t("detail.allOrders")}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              {locked ? (
                <Tooltip>
                  <TooltipTrigger render={<span className="flex" />}>
                    <Button disabled>
                      <RotateCcwIcon data-icon="inline-start" aria-hidden />
                      {t("detail.unlock")}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t("soon")}</TooltipContent>
                </Tooltip>
              ) : (
                <Button variant="destructive" onClick={() => setLocking(true)}>
                  <BanIcon data-icon="inline-start" aria-hidden />
                  {t("detail.lock")}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
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
      <Tabs
        value={tab}
        onValueChange={(next) => {
          if (next !== tab)
            router.push(next === "orders" ? here : `${here}?tab=${next}`, { scroll: false });
        }}
      >
        <TabsList variant="line" aria-label={t("detail.tabs.label")}>
          {detailTabs.map((key) => (
            <TabsTrigger key={key} value={key}>
              {t(`detail.tabs.${key}`)}
              <Badge variant="secondary">{counts[key]}</Badge>
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
          <TabsContent value={tab} className="min-w-0">
            {tab === "orders" && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    <h2>{t("detail.tabs.orders")}</h2>
                  </CardTitle>
                  {account.orders > 0 && (
                    <CardAction>
                      <Link href={orders} className={link}>
                        {t("detail.seeAll", { count: account.orders })}
                      </Link>
                    </CardAction>
                  )}
                </CardHeader>
                <CardContent>
                  {account.recentOrders.length === 0 ? (
                    <p className="text-body-sm text-muted-foreground">{t("detail.noOrders")}</p>
                  ) : (
                    <ItemGroup>
                      {account.recentOrders.map((order) => {
                        const look = orderLook(order.status);
                        return (
                          <Item key={order.id} variant="outline" render={<li />}>
                            <ItemMedia variant={order.photoUrl ? "image" : "icon"}>
                              {order.photoUrl ? (
                                <Image
                                  src={order.photoUrl}
                                  alt=""
                                  width={40}
                                  height={40}
                                  unoptimized
                                />
                              ) : (
                                <PackageIcon aria-hidden />
                              )}
                            </ItemMedia>
                            <ItemContent>
                              <ItemTitle>
                                <Link
                                  href={adminHref("orderDetail", { orderId: order.id })}
                                  className={link}
                                >
                                  {t("detail.orderLine", {
                                    item: order.item,
                                    seller: order.sellerName,
                                  })}
                                </Link>
                              </ItemTitle>
                            </ItemContent>
                            <ItemActions>
                              <span className="text-body-sm-strong tabular-nums">
                                {formatPrice(order.amountVnd)}
                              </span>
                              <Badge variant={look.variant}>
                                <look.icon aria-hidden />
                                {t(`orderStatus.${order.status}`)}
                              </Badge>
                            </ItemActions>
                          </Item>
                        );
                      })}
                    </ItemGroup>
                  )}
                </CardContent>
              </Card>
            )}
            {tab === "stores" && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    <h2>{t("detail.tabs.stores")}</h2>
                  </CardTitle>
                </CardHeader>
                <CardContent>{sellerLinks}</CardContent>
              </Card>
            )}
            {tab === "issues" && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    <h2>{t("detail.tabs.issues")}</h2>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {account.issues.length === 0 ? (
                    <p className="text-body-sm text-muted-foreground">{t("detail.noIssues")}</p>
                  ) : (
                    <ul className="flex flex-col gap-3">
                      {account.issues.map((issue) => (
                        <li key={issue.id}>
                          <Link
                            href={adminHref("issueDetail", { issueId: issue.id })}
                            className={link}
                          >
                            {t("detail.issueLine", { code: issue.code, title: issue.title })}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <div className="flex w-full shrink-0 flex-col gap-5 lg:w-90">
            {locked && (
              <Alert variant="destructive">
                <BanIcon aria-hidden />
                <AlertTitle>{t("locked.title")}</AlertTitle>
                <AlertDescription>
                  <ul className="flex flex-col gap-2">
                    <li className="flex gap-2">
                      <BanIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
                      {t("locked.signIn")}
                    </li>
                    <li className="flex gap-2">
                      <CircleXIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
                      {t("locked.orders")}
                    </li>
                    <li className="flex gap-2">
                      <CircleCheckIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
                      {t("locked.history")}
                    </li>
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            <Card>
              <CardHeader>
                <CardTitle>
                  <h2>{t("detail.info")}</h2>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="flex flex-col gap-3">
                  {facts.map(({ term, value }) => (
                    <div key={term} className="flex items-center justify-between gap-3">
                      <dt className="text-body-sm text-muted-foreground">{term}</dt>
                      <dd className="text-right text-body-sm-strong text-foreground">{value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>
                  <h2>{t("detail.sellers")}</h2>
                </CardTitle>
              </CardHeader>
              <CardContent>{sellerLinks}</CardContent>
            </Card>
          </div>
        </div>
      </Tabs>
      <LockAccountDialog
        name={account.name}
        heldOrders={account.heldOrders}
        open={locking}
        onOpenChange={setLocking}
      />
    </>
  );
}
