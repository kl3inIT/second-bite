"use client";

import { BanIcon, EyeIcon, RotateCcwIcon, UsersIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useRouter } from "@/i18n/navigation";

import { fromDay, toDay } from "../offers/offer";
import { adminHref } from "../pages";
import { DataTable, DateCell, StrongCell, TextCell } from "../ui/data-table";
import { EmptyState } from "../ui/empty-state";
import { DateRangeFilter, FilterBar, FilterSelect, SearchField } from "../ui/filter-bar";
import { PageHeader } from "../ui/page-header";
import { Pagination } from "../ui/pagination";
import { RowActionMenu } from "../ui/row-action-menu";
import { AdminTabs } from "../ui/tabs";
import {
  type AccountQuery,
  type AccountSortKey,
  type AccountTab,
  type AdminAccountRow,
  accountStatuses,
  accountTabs,
  accountsHref,
  sellersLabel,
  toggleSort,
} from "./account";
import { AccountAvatar, AccountRoleBadge, AccountStatusBadge } from "./account-badges";
import { LockAccountDialog } from "./lock-account-dialog";
import { pageSizes } from "../list-query";

/** Moves the list to a new state through its address, back on the first page. */
function useAccountFilters(query: AccountQuery) {
  const router = useRouter();
  return (patch: Partial<AccountQuery>) =>
    router.replace(accountsHref({ ...query, page: 1, ...patch }), { scroll: false });
}

/**
 * The accounts (Figma AD-TK1): the tabs Tất cả, Khách, Chủ cửa hàng/Nhân viên, Quản trị with their counts, the
 * filters, then one row per account with its role, stores, orders, day created and status, the newest first. A
 * row opens the account; its menu locks it after a question (AD-TK3). Its state lives in the address.
 */
export function AccountsList({
  query,
  rows,
  total,
  counts,
}: {
  query: AccountQuery;
  rows: AdminAccountRow[];
  total: number;
  counts?: Record<AccountTab, number>;
}) {
  const t = useTranslations("admin.accounts");
  const shell = useTranslations("admin.shell");
  const setFilters = useAccountFilters(query);
  const [search, setSearch] = useState(query.q);
  const [locking, setLocking] = useState<AdminAccountRow>();

  // The search follows the typing once it pauses, so each key does not reload the list.
  useEffect(() => {
    if (search.trim() === query.q) return;
    const timer = setTimeout(() => setFilters({ q: search.trim() }), 300);
    return () => clearTimeout(timer);
  }, [search, query.q, setFilters]);

  const sortOf = (key: AccountSortKey) => ({
    direction: query.sort === key ? query.direction : ("none" as const),
    href: accountsHref(toggleSort(query, key)),
  });
  const detail = (account: AdminAccountRow) =>
    adminHref("accountDetail", { accountId: account.id });

  return (
    <>
      <PageHeader title={shell("pages.accounts.label")} />
      <AdminTabs
        label={t("tabs.label")}
        current={query.tab}
        tabs={accountTabs.map((tab) => ({
          key: tab,
          label: t(`tabs.${tab}`),
          href: accountsHref({ ...query, tab, page: 1 }),
          count: counts?.[tab],
        }))}
      />
      <FilterBar>
        <SearchField
          label={t("filters.search")}
          placeholder={t("filters.searchPlaceholder")}
          value={search}
          onChange={setSearch}
        />
        <FilterSelect
          label={t("filters.status")}
          value={query.status ?? ""}
          options={[
            { value: "", label: t("filters.all") },
            ...accountStatuses.map((status) => ({ value: status, label: t(`status.${status}`) })),
          ]}
          onChange={(status) =>
            setFilters({ status: status ? (status as AccountQuery["status"]) : undefined })
          }
        />
        <DateRangeFilter
          label={t("filters.created")}
          value={{ from: fromDay(query.from), to: fromDay(query.to) }}
          onChange={(range) =>
            setFilters({ from: range.from && toDay(range.from), to: range.to && toDay(range.to) })
          }
        />
        <FilterSelect
          label={t("filters.size")}
          value={String(query.size)}
          options={pageSizes.map((size) => ({ value: String(size), label: String(size) }))}
          onChange={(size) => setFilters({ size: Number(size) as AccountQuery["size"] })}
        />
      </FilterBar>
      <DataTable
        caption={shell("pages.accounts.label")}
        rows={rows}
        rowKey={(account) => account.id}
        rowHref={detail}
        columns={[
          {
            key: "name",
            header: t("columns.name"),
            grow: true,
            sort: sortOf("name"),
            cell: (account) => (
              <span className="flex min-w-48 items-center gap-2.5">
                <AccountAvatar name={account.name} />
                <StrongCell href={detail(account)}>{account.name}</StrongCell>
              </span>
            ),
          },
          {
            key: "role",
            header: t("columns.role"),
            cell: (account) => <AccountRoleBadge role={account.role} />,
          },
          {
            key: "sellers",
            header: t("columns.sellers"),
            cell: (account) => <TextCell>{sellersLabel(account.sellers) ?? "—"}</TextCell>,
          },
          {
            key: "orders",
            header: t("columns.orders"),
            sort: sortOf("orders"),
            cell: (account) => <TextCell>{account.orders}</TextCell>,
          },
          {
            key: "createdAt",
            header: t("columns.createdAt"),
            sort: sortOf("createdAt"),
            cell: (account) => <DateCell value={account.createdAt} />,
          },
          {
            key: "status",
            header: t("columns.status"),
            cell: (account) => <AccountStatusBadge status={account.status} />,
          },
          {
            key: "actions",
            header: t("columns.actions"),
            align: "end",
            cell: (account) => (
              <RowActionMenu
                name={account.name}
                actions={[
                  { label: t("view"), icon: EyeIcon, href: detail(account) },
                  account.status === "locked"
                    ? { label: t("unlock"), icon: RotateCcwIcon, disabled: true }
                    : {
                        label: t("lockMenu"),
                        icon: BanIcon,
                        destructive: true,
                        onSelect: () => setLocking(account),
                      },
                ]}
              />
            ),
          },
        ]}
        empty={<EmptyState icon={UsersIcon} title={t(`empty.${query.tab}`)} />}
        footer={
          total > 0 && (
            <Pagination
              page={query.page}
              pageSize={query.size}
              total={total}
              hrefFor={(page) => accountsHref({ ...query, page })}
              summary={(range) => t("summary", range)}
            />
          )
        }
      />
      <LockAccountDialog
        name={locking?.name ?? ""}
        heldOrders={[]}
        open={locking !== undefined}
        onOpenChange={(open) => {
          if (!open) setLocking(undefined);
        }}
      />
    </>
  );
}
