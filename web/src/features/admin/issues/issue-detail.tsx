"use client";

import { EyeIcon, RotateCcwIcon } from "lucide-react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { type ReactNode, useId, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { initials } from "@/features/offers/seller";
import { formatPrice } from "@/features/offers/format";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { AdminCrumb } from "../admin-crumbs";
import { adminHref } from "../pages";
import { AdminBadge } from "../ui/badge";
import { PageHeader } from "../ui/page-header";
import { SegmentedControl } from "../ui/segmented-control";
import { type AdminIssue, type IssueMessage, type IssueStatus, issueStatuses } from "./issue";
import { IssueKindBadge, IssueStatusBadge } from "./issue-badges";
import { MarkDoneDialog } from "./mark-done-dialog";

/**
 * One problem report (Figma AD-BL2): its number and title, its type and status; on the left what was sent with
 * its photos, then the conversation, where an internal note shows dashed in amber with "Chỉ admin thấy", and the
 * box to reply to the customer or write a note; on the right who handles it and the order it is about. Choosing
 * "Đã xong" opens the dialog that closes it (AD-BL3).
 */
export function IssueDetail({ issue }: { issue: AdminIssue }) {
  const t = useTranslations("admin.issues");
  const [closing, setClosing] = useState(false);

  return (
    <>
      <AdminCrumb label={issue.code} />
      <PageHeader title={t("detail.title", { code: issue.code, title: issue.title })} />
      <div className="-mt-1 flex flex-wrap items-center gap-3">
        <IssueKindBadge kind={issue.kind} />
        <IssueStatusBadge status={issue.status} />
      </div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <Report issue={issue} />
          <Conversation issue={issue} />
        </div>
        <div className="flex w-full shrink-0 flex-col gap-5 lg:w-90">
          <Handling issue={issue} onDone={() => setClosing(true)} />
          {issue.order && <RelatedOrder order={issue.order} />}
          <Soon>
            <Button variant="outline" disabled className="w-full">
              <RotateCcwIcon data-icon="inline-start" aria-hidden />
              {t("detail.refund")}
            </Button>
          </Soon>
        </div>
      </div>
      <MarkDoneDialog code={issue.code} open={closing} onOpenChange={setClosing} />
    </>
  );
}

/** Wraps a control whose backend does not exist yet, so the pointer reads "Sắp có" over it (admin-qa › Nút thao tác). */
function Soon({ children }: { children: ReactNode }) {
  const t = useTranslations("admin.issues");
  return (
    <span title={t("soon")} className="flex">
      {children}
    </span>
  );
}

function Card({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
      {title && <h2 className="text-title-lg text-foreground">{title}</h2>}
      {children}
    </section>
  );
}

function Report({ issue }: { issue: AdminIssue }) {
  const t = useTranslations("admin.issues.detail");
  return (
    <Card>
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-fresh-muted text-label-strong text-fresh-foreground"
        >
          {initials(issue.sender.name)}
        </span>
        <p className="text-body-sm-strong text-foreground">{issue.sender.name}</p>
      </div>
      <p className="text-body whitespace-pre-line text-foreground">{issue.body}</p>
      {issue.photos.length > 0 && (
        <>
          <p className="text-label-strong text-muted-foreground">
            {t("photos", { count: issue.photos.length })}
          </p>
          <ul className="flex flex-wrap gap-3">
            {issue.photos.map((photo, index) => (
              <li key={photo.id}>
                <Image
                  src={photo.url}
                  alt={t("photo", { index: index + 1 })}
                  width={96}
                  height={96}
                  unoptimized
                  className="size-24 rounded-md object-cover"
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}

function Conversation({ issue }: { issue: AdminIssue }) {
  const t = useTranslations("admin.issues.detail");
  const [mode, setMode] = useState<"reply" | "note">("reply");

  return (
    <Card title={t("thread")}>
      {issue.messages.length > 0 && (
        <ol className="flex flex-col gap-3">
          {issue.messages.map((message) => (
            <li key={message.id}>
              <Message message={message} />
            </li>
          ))}
        </ol>
      )}
      <div className="flex flex-col gap-3 border-t border-border pt-4">
        <SegmentedControl
          label={t("composer")}
          value={mode}
          onChange={setMode}
          segments={[
            { value: "reply", label: t("reply") },
            { value: "note", label: t("note") },
          ]}
        />
        <Textarea
          aria-label={mode === "reply" ? t("reply") : t("note")}
          placeholder={
            mode === "reply"
              ? t("replyPlaceholder", { name: issue.sender.name })
              : t("notePlaceholder")
          }
          rows={4}
        />
        <div className="flex justify-end">
          <Soon>
            <Button disabled>{t("send")}</Button>
          </Soon>
        </div>
      </div>
    </Card>
  );
}

/**
 * A line of the conversation (Figma AD-BL2 › Thread): the customer's or the store's on the pale sky, an admin's
 * reply on the sky wash with its name in blue, both 560px at most; an internal note across the whole width,
 * dashed in amber, marked "Chỉ admin thấy".
 */
function Message({ message }: { message: IssueMessage }) {
  const t = useTranslations("admin.issues.detail");
  const format = useFormatter();
  const at = new Date(message.at);
  const time = (
    <time dateTime={at.toISOString()} className="text-label">
      {format.dateTime(at, "time")}
    </time>
  );

  if (message.internal) {
    return (
      <article className="flex flex-col gap-1.5 rounded-xl border border-dashed border-warning-border bg-warning px-4 py-3 text-warning-foreground">
        <header className="flex flex-wrap items-center gap-2">
          <AdminBadge tone="warning" icon={EyeIcon}>
            {t("internalOnly")}
          </AdminBadge>
          <span className="text-label-strong">
            {t("internalNote", { name: message.author.name })}
          </span>
          {time}
        </header>
        <p className="text-body-sm whitespace-pre-line">{message.body}</p>
      </article>
    );
  }

  const admin = message.author.role === "admin";
  return (
    <article
      className={cn(
        "flex max-w-140 flex-col gap-1.5 rounded-xl px-4 py-3",
        admin ? "bg-secondary" : "bg-muted",
      )}
    >
      <header className="flex flex-wrap items-center gap-2 text-muted-foreground">
        <span className={cn("text-label-strong", admin ? "text-primary" : "text-foreground")}>
          {t("author", { name: message.author.name, role: t(`role.${message.author.role}`) })}
        </span>
        {time}
      </header>
      <p className="text-body-sm whitespace-pre-line text-foreground">{message.body}</p>
    </article>
  );
}

/**
 * Who handles the report and where it stands (Figma AD-BL2 › Card · Xử lý). Choosing "Đã xong" opens the dialog
 * that closes it; giving it to an admin waits for its backend.
 */
function Handling({ issue, onDone }: { issue: AdminIssue; onDone: () => void }) {
  const t = useTranslations("admin.issues");
  const unassigned = { value: "", label: t("unassigned") };

  return (
    <Card title={t("detail.handling")}>
      <HandlingSelect
        label={t("detail.status")}
        value={issue.status}
        options={issueStatuses.map((status) => ({ value: status, label: t(`status.${status}`) }))}
        onChange={(status) => {
          if ((status as IssueStatus) === "done" && issue.status !== "done") onDone();
        }}
      />
      <span title={t("soon")} className="flex">
        <HandlingSelect
          label={t("detail.handler")}
          value={issue.handler?.id ?? ""}
          options={[
            unassigned,
            ...issue.handlers.map((handler) => ({ value: handler.id, label: handler.name })),
          ]}
          disabled
        />
      </span>
    </Card>
  );
}

/** A select across the card, "Trạng thái: Đang xử lý" (Figma Admin/Select 228:5658 at full width). */
function HandlingSelect({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange?: (value: string) => void;
  disabled?: boolean;
}) {
  // A combobox takes no name from what it holds, so it is named by its label (as FilterSelect).
  const labelId = useId();
  return (
    <Select
      value={value}
      items={options}
      disabled={disabled}
      onValueChange={(next) => {
        if (typeof next === "string") onChange?.(next);
      }}
    >
      <SelectTrigger aria-labelledby={labelId} className="w-full">
        <span id={labelId} className="text-muted-foreground">
          {label}:
        </span>
        <span className="text-body-sm-strong text-foreground">
          <SelectValue />
        </span>
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} align="start">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/** The order the report is about (Figma AD-BL2 › Card · Liên quan): its number, store, item, amount, payment, pickup. */
function RelatedOrder({ order }: { order: NonNullable<AdminIssue["order"]> }) {
  const t = useTranslations("admin.issues.detail");
  const format = useFormatter();
  const method = t(`paymentMethod.${order.payment.method}`);
  const link =
    "rounded-sm text-body-sm-strong text-primary underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
      <h2 className="text-title-lg text-foreground">{t("related")}</h2>
      <dl className="flex flex-col gap-3">
        <Row term={t("order")}>
          <Link href={adminHref("orderDetail", { orderId: order.id })} className={link}>
            #{order.code}
          </Link>
        </Row>
        <Row term={t("store")}>
          <Link href={adminHref("sellerDetail", { sellerId: order.sellerId })} className={link}>
            {order.sellerName}
          </Link>
        </Row>
        <Row term={t("item")}>{order.item}</Row>
        <Row term={t("amount")}>{formatPrice(order.amountVnd)}</Row>
        <Row term={t("payment")}>
          {order.payment.paid ? t("paid", { method }) : t("unpaid", { method })}
        </Row>
        {order.collectedAt && (
          <Row term={t("collectedAt")}>
            {format.dateTime(new Date(order.collectedAt), "day")} ·{" "}
            {format.dateTime(new Date(order.collectedAt), "time")}
          </Row>
        )}
      </dl>
    </section>
  );
}

function Row({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-body-sm text-muted-foreground">{term}</dt>
      <dd className="text-right text-body-sm-strong text-foreground">{children}</dd>
    </div>
  );
}
