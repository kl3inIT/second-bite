"use client";

import { debounce, useQueryStates } from "nuqs";
import { useFormatter, useTranslations } from "next-intl";
import { useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable, SortHeader, type DataTableColumns } from "@/features/admin/data-table";
import { SearchBox } from "@/features/admin/search-box";
import { ListFooter } from "@/features/admin/list-footer";
import { Link } from "@/i18n/navigation";
import type { MembershipBody, RecordBody, RoleCountsBody } from "@/lib/api/generated";

import { AccountAvatar, nameOf, RoleBadge, SignedIn } from "./account-parts";
import { AccountRowMenu } from "./account-row-menu";
import {
  accountPageSizes,
  accountSearchParams,
  serializeAccountSearchParams,
  sortedOf,
  sortOf,
  type AccountSortColumn,
} from "./search-params";

const everyone = "all";

/**
 * The accounts (Figma AD-TK1, as SEC-75 proposes it): a tab per role with its count, words and the page size
 * in the address, a page of accounts the server read for them, sorted by the head pressed. Each account's
 * name opens it, and its "⋯" menu opens it too or changes its role. The stores it belongs to are read for the
 * page beside it, since they are the seller module's.
 */
export function AccountsList({
  accounts,
  total,
  counts,
  memberships,
  myId,
  adminCount,
}: {
  accounts: RecordBody[];
  total: number;
  counts: RoleCountsBody;
  memberships: MembershipBody[];
  /** The admin reading, and how many admins there are in all, whatever the words: who may be revoked. */
  myId: string;
  adminCount: number;
}) {
  const t = useTranslations("Admin.accounts");
  const [pending, startTransition] = useTransition();
  const [params, setParams] = useQueryStates(accountSearchParams, {
    shallow: false,
    startTransition,
  });
  const sorted = sortedOf(params.sort);
  const columns = useColumns(
    memberships,
    sorted,
    (column, direction) => void setParams({ sort: sortOf(column, direction), page: null }),
    { myId, adminCount },
  );

  const tabs = [
    { value: everyone, label: t("tab.all"), count: counts.customer + counts.admin },
    { value: "customer", label: t("tab.customer"), count: counts.customer },
    { value: "admin", label: t("tab.admin"), count: counts.admin },
  ] as const;

  return (
    <section aria-label={t("title")} className="flex flex-col gap-5">
      <Tabs
        value={params.role ?? everyone}
        onValueChange={(role) =>
          void setParams({
            role: role === everyone ? null : (role as "customer" | "admin"),
            page: null,
          })
        }
      >
        <TabsList variant="line" aria-label={t("tab.label")}>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="min-h-11 flex-none">
              {tab.label}
              <Badge variant="info">{tab.count}</Badge>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="flex flex-wrap items-center gap-3">
        <SearchBox
          label={t("search")}
          className="sm:max-w-md"
          value={params.q}
          onChange={(q) =>
            void setParams(
              { q, page: null },
              { limitUrlUpdates: q === "" ? undefined : debounce(300) },
            )
          }
        />
        <Select
          value={String(params.size)}
          items={accountPageSizes.map((size) => ({ value: String(size), label: String(size) }))}
          onValueChange={(size) =>
            void setParams({ size: Number(size) as (typeof accountPageSizes)[number], page: null })
          }
        >
          <SelectTrigger size="lg" aria-label={t("size")} className="sm:ms-auto">
            <span className="text-muted-foreground">{t("size")}:</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {accountPageSizes.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <DataTable
        label={t("title")}
        columns={columns}
        rows={accounts}
        rowKey={(account) => account.id}
        busy={pending}
        sorted={sorted}
        empty={
          <Empty>
            <EmptyHeader>
              <EmptyTitle>{params.q ? t("noResults.title") : t("empty.title")}</EmptyTitle>
              <EmptyDescription>
                {params.q ? t("noResults.body") : t("empty.body")}
              </EmptyDescription>
            </EmptyHeader>
            {params.q && (
              <EmptyContent>
                <Button variant="outline" onClick={() => void setParams({ q: null, page: null })}>
                  {t("noResults.clear")}
                </Button>
              </EmptyContent>
            )}
          </Empty>
        }
        footer={
          <ListFooter
            page={params.page}
            pageSize={params.size}
            total={total}
            noun={t("noun")}
            hrefOf={(page) => serializeAccountSearchParams({ ...params, page })}
            onPage={(page) => void setParams({ page })}
          />
        }
      />
    </section>
  );
}

function useColumns(
  memberships: MembershipBody[],
  sorted: ReturnType<typeof sortedOf>,
  onSort: (column: AccountSortColumn, direction: "ascending" | "descending") => void,
  roles: { myId: string; adminCount: number },
): DataTableColumns<RecordBody> {
  const t = useTranslations("Admin.accounts");
  const format = useFormatter();
  const sortable = (column: AccountSortColumn, label: string) => (
    <SortHeader
      label={label}
      column={column}
      sorted={sorted}
      onSort={(direction) => onSort(column, direction)}
    />
  );

  return [
    {
      id: "name",
      header: () => sortable("name", t("column.account")),
      cell: ({ row }) => (
        <div className="flex min-w-48 items-center gap-3">
          <AccountAvatar account={row.original} />
          <div className="flex min-w-0 flex-col">
            <Link
              href={`/admin/accounts/${row.original.id}`}
              className="truncate text-body-sm-strong text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              {nameOf(row.original)}
            </Link>
            {row.original.displayName && (
              <span className="truncate text-label text-muted-foreground">
                {row.original.email}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "role",
      header: t("column.role"),
      cell: ({ row }) => <RoleBadge role={row.original.role} />,
    },
    {
      id: "sellers",
      header: t("column.sellers"),
      cell: ({ row }) => {
        const own = memberships.filter((m) => m.accountId === row.original.id);
        if (own.length === 0) return <span className="text-muted-foreground">—</span>;
        const [first, ...rest] = own;
        return (
          <span className="whitespace-nowrap">
            {t("sellerRole", { seller: first.sellerName, role: first.role })}
            {rest.length > 0 && <span className="text-muted-foreground"> +{rest.length}</span>}
          </span>
        );
      },
    },
    {
      id: "method",
      header: t("column.method"),
      cell: ({ row }) =>
        row.original.lastSignInMethod ? (
          t(`method.${row.original.lastSignInMethod}`)
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      id: "created",
      header: () => sortable("created", t("column.created")),
      cell: ({ row }) => (
        <time dateTime={row.original.createdAt} className="whitespace-nowrap">
          {format.dateTime(new Date(row.original.createdAt), "day")}
        </time>
      ),
    },
    {
      id: "signedIn",
      header: () => sortable("signedIn", t("column.signedIn")),
      cell: ({ row }) => <SignedIn at={row.original.lastSignedInAt} />,
    },
    {
      id: "actions",
      header: () => <span className="sr-only">{t("column.actions")}</span>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <AccountRowMenu account={row.original} {...roles} />
        </div>
      ),
    },
  ];
}
