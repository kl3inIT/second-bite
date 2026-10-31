"use client";

import {
  BanIcon,
  BanknoteIcon,
  CircleCheckIcon,
  CircleXIcon,
  EyeIcon,
  EyeOffIcon,
  MailIcon,
  SettingsIcon,
  ShieldMinusIcon,
  ShieldPlusIcon,
  TagIcon,
  Trash2Icon,
  UndoIcon,
  UserRoundCogIcon,
  type LucideIcon,
} from "lucide-react";
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
import { DataTable, type DataTableColumns } from "@/features/admin/data-table";
import { SearchBox } from "@/features/admin/search-box";
import { DayRange } from "@/features/admin/day-range";
import { ListFooter } from "@/features/admin/list-footer";
import type { AccountBody, AuditEventBody } from "@/lib/api/generated";

import { AuditChange } from "./audit-change";
import {
  actionMessage,
  auditActions,
  auditPageSize,
  auditSearchParams,
  serializeAuditSearchParams,
  type AuditAction,
} from "./search-params";

// Each action's chip in the log (Figma AD-CD5 › Hành động): a tone and an icon, never colour alone.
const actionLook: Record<
  AuditAction,
  { variant: "success" | "danger" | "info" | "warning"; icon: LucideIcon }
> = {
  "seller.approve": { variant: "success", icon: CircleCheckIcon },
  "seller.reject": { variant: "danger", icon: CircleXIcon },
  "seller.block": { variant: "danger", icon: BanIcon },
  "seller.unblock": { variant: "success", icon: CircleCheckIcon },
  "seller.delete": { variant: "danger", icon: Trash2Icon },
  "seller.restore": { variant: "info", icon: UndoIcon },
  "seller.change_owner": { variant: "info", icon: UserRoundCogIcon },
  "review.hide": { variant: "danger", icon: EyeOffIcon },
  "review.show": { variant: "success", icon: EyeIcon },
  "admin.grant": { variant: "info", icon: ShieldPlusIcon },
  "admin.revoke": { variant: "warning", icon: ShieldMinusIcon },
  "offer_settings.change": { variant: "info", icon: SettingsIcon },
  "email_settings.change": { variant: "info", icon: MailIcon },
  "promotion.create": { variant: "success", icon: TagIcon },
  "promotion.change": { variant: "info", icon: TagIcon },
  "seller.mark_payout": { variant: "success", icon: BanknoteIcon },
};

const all = "all";

/**
 * The admins' log (Figma AD-CD5): words, an action, an admin and a range of days in the address, a page of
 * events the server read for them, and the pages. A change of filter asks the server again inside a
 * transition, and the rows dim until the new page comes.
 */
export function AuditLog({
  events,
  total,
  admins,
}: {
  events: AuditEventBody[];
  total: number;
  admins: AccountBody[];
}) {
  const t = useTranslations("Admin.audit");
  const [pending, startTransition] = useTransition();
  const [params, setParams] = useQueryStates(auditSearchParams, {
    shallow: false,
    startTransition,
  });
  const filtered =
    params.q !== "" || params.action !== null || params.actor !== null || params.from !== null;

  const columns = useColumns();

  return (
    <section aria-label={t("title")} className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <SearchBox
          label={t("filter.search")}
          className="sm:w-72"
          value={params.q}
          onChange={(q) =>
            void setParams(
              { q, page: null },
              { limitUrlUpdates: q === "" ? undefined : debounce(300) },
            )
          }
        />
        <Select
          value={params.actor ?? all}
          items={[
            { value: all, label: t("filter.anyone") },
            ...admins.map((admin) => ({ value: admin.id, label: admin.email })),
          ]}
          onValueChange={(actor) =>
            void setParams({ actor: actor === all ? null : actor, page: null })
          }
        >
          <SelectTrigger size="lg" aria-label={t("filter.actor")}>
            <span className="text-muted-foreground">{t("filter.actor")}:</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={all}>{t("filter.anyone")}</SelectItem>
              {admins.map((admin) => (
                <SelectItem key={admin.id} value={admin.id}>
                  {admin.email}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          value={params.action ?? all}
          items={[
            { value: all, label: t("filter.anything") },
            ...auditActions.map((action) => ({
              value: action,
              label: t(`action.${actionMessage[action]}`),
            })),
          ]}
          onValueChange={(action) =>
            void setParams({ action: action === all ? null : (action as AuditAction), page: null })
          }
        >
          <SelectTrigger size="lg" aria-label={t("filter.action")}>
            <span className="text-muted-foreground">{t("filter.action")}:</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={all}>{t("filter.anything")}</SelectItem>
              {auditActions.map((action) => (
                <SelectItem key={action} value={action}>
                  {t(`action.${actionMessage[action]}`)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <DayRange
          label={t("filter.days")}
          anytime={t("filter.anytime")}
          from={params.from}
          to={params.to}
          onChange={(from, to) => void setParams({ from, to, page: null })}
        />
      </div>
      <DataTable
        label={t("title")}
        columns={columns}
        rows={events}
        rowKey={(event) => event.id}
        busy={pending}
        empty={
          <Empty>
            <EmptyHeader>
              <EmptyTitle>{filtered ? t("noResults.title") : t("empty.title")}</EmptyTitle>
              <EmptyDescription>
                {filtered ? t("noResults.body") : t("empty.body")}
              </EmptyDescription>
            </EmptyHeader>
            {filtered && (
              <EmptyContent>
                <Button
                  variant="outline"
                  onClick={() =>
                    void setParams({
                      q: null,
                      action: null,
                      actor: null,
                      from: null,
                      to: null,
                      page: null,
                    })
                  }
                >
                  {t("noResults.clear")}
                </Button>
              </EmptyContent>
            )}
          </Empty>
        }
        footer={
          <ListFooter
            page={params.page}
            pageSize={auditPageSize}
            total={total}
            noun={t("noun")}
            hrefOf={(page) => serializeAuditSearchParams({ ...params, page })}
            onPage={(page) => void setParams({ page })}
          />
        }
      />
    </section>
  );
}

function useColumns(): DataTableColumns<AuditEventBody> {
  const t = useTranslations("Admin.audit");
  const format = useFormatter();

  return [
    {
      id: "time",
      header: t("column.time"),
      cell: ({ row }) => {
        const at = new Date(row.original.occurredAt);
        return (
          <time dateTime={row.original.occurredAt} className="flex flex-col whitespace-nowrap">
            <span>{format.dateTime(at, "day")}</span>
            <span className="text-muted-foreground">{format.dateTime(at, "time")}</span>
          </time>
        );
      },
    },
    {
      id: "actor",
      header: t("column.actor"),
      cell: ({ row }) =>
        row.original.actorLabel ?? (row.original.actorId ? t("deletedAccount") : t("commandLine")),
    },
    {
      id: "action",
      header: t("column.action"),
      cell: ({ row }) => {
        const { variant, icon: Icon } = actionLook[row.original.action];
        return (
          <Badge variant={variant}>
            <Icon data-icon="inline-start" aria-hidden />
            {t(`action.${actionMessage[row.original.action]}`)}
          </Badge>
        );
      },
    },
    {
      id: "resource",
      header: t("column.resource"),
      cell: ({ row }) => (
        <span className="text-body-sm-strong">
          {row.original.resourceLabel ??
            (row.original.resourceType === "account"
              ? t("deletedAccount")
              : t(`resource.${row.original.resourceType}`))}
        </span>
      ),
    },
    {
      id: "change",
      header: t("column.change"),
      cell: ({ row }) => <AuditChange event={row.original} />,
    },
  ];
}
