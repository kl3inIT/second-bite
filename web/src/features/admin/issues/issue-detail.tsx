"use client";

import { EyeIcon, RotateCcwIcon } from "lucide-react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { useId, useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { initials } from "@/features/offers/seller";
import { formatPrice } from "@/features/offers/format";
import { Link } from "@/i18n/navigation";

import { AdminCrumb } from "../admin-crumbs";
import { adminHref } from "../pages";
import { type AdminIssue, type IssueStatus, issueStatuses, kindLook, statusLook } from "./issue";
import { MarkDoneDialog } from "./mark-done-dialog";

/**
 * One problem report (Figma AD-BL2): its number and title, its type and status; on the left what was sent with
 * its photos, then the conversation, where an internal note is marked "Chỉ admin thấy", and the box to reply to
 * the customer or write a note; on the right who handles it and the order it is about. Choosing "Đã xong" opens
 * the dialog that closes it (AD-BL3). What waits for its backend says "Sắp có" under the pointer.
 */
export function IssueDetail({ issue }: { issue: AdminIssue }) {
  const t = useTranslations("admin.issues");
  const [closing, setClosing] = useState(false);
  const kind = kindLook(issue.kind);
  const status = statusLook(issue.status);

  return (
    <>
      <AdminCrumb label={issue.code} />
      <h1 className="text-page-title text-foreground">
        {t("detail.title", { code: issue.code, title: issue.title })}
      </h1>
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant={kind.variant}>
          <kind.icon aria-hidden />
          {t(`kind.${issue.kind}`)}
        </Badge>
        <Badge variant={status.variant}>
          <status.icon aria-hidden />
          {t(`status.${issue.status}`)}
        </Badge>
      </div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <Report issue={issue} />
          <Conversation issue={issue} />
        </div>
        <div className="flex w-full shrink-0 flex-col gap-5 lg:w-90">
          <Handling issue={issue} onDone={() => setClosing(true)} />
          {issue.order && <RelatedOrder order={issue.order} />}
          <Tooltip>
            <TooltipTrigger render={<span className="flex" />}>
              <Button variant="outline" disabled className="w-full">
                <RotateCcwIcon data-icon="inline-start" aria-hidden />
                {t("detail.refund")}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("soon")}</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <MarkDoneDialog code={issue.code} open={closing} onOpenChange={setClosing} />
    </>
  );
}

/** What the customer or the store sent: who, the words and the photos. */
function Report({ issue }: { issue: AdminIssue }) {
  const t = useTranslations("admin.issues.detail");
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Avatar size="lg" aria-hidden>
              <AvatarFallback>{initials(issue.sender.name)}</AvatarFallback>
            </Avatar>
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
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * The conversation (Figma AD-BL2 › Thread): the customer's or the store's lines on the pale ground, an admin's
 * reply edged, an internal note marked "Chỉ admin thấy"; then the box to write a reply or a note.
 */
function Conversation({ issue }: { issue: AdminIssue }) {
  const t = useTranslations("admin.issues.detail");
  const soon = useTranslations("admin.issues")("soon");
  const format = useFormatter();
  const [mode, setMode] = useState<"reply" | "note">("reply");

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>{t("thread")}</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {issue.messages.length > 0 && (
            <ol className="flex flex-col gap-3">
              {issue.messages.map((message) => {
                const at = new Date(message.at);
                return (
                  <li key={message.id}>
                    <Item
                      variant={
                        message.internal || message.author.role === "admin" ? "outline" : "muted"
                      }
                      render={<article />}
                    >
                      <ItemContent>
                        <ItemTitle>
                          {message.internal && (
                            <Badge variant="outline">
                              <EyeIcon aria-hidden />
                              {t("internalOnly")}
                            </Badge>
                          )}
                          <span className="text-label-strong">
                            {message.internal
                              ? t("internalNote", { name: message.author.name })
                              : t("author", {
                                  name: message.author.name,
                                  role: t(`role.${message.author.role}`),
                                })}
                          </span>
                          <time
                            dateTime={at.toISOString()}
                            className="text-label text-muted-foreground"
                          >
                            {format.dateTime(at, "time")}
                          </time>
                        </ItemTitle>
                        <p className="text-body-sm whitespace-pre-line text-foreground">
                          {message.body}
                        </p>
                      </ItemContent>
                    </Item>
                  </li>
                );
              })}
            </ol>
          )}
          <Separator />
          <ToggleGroup
            variant="outline"
            aria-label={t("composer")}
            value={[mode]}
            onValueChange={(next) => {
              const chosen = next[0];
              if (chosen === "reply" || chosen === "note") setMode(chosen);
            }}
          >
            <ToggleGroupItem value="reply">{t("reply")}</ToggleGroupItem>
            <ToggleGroupItem value="note">{t("note")}</ToggleGroupItem>
          </ToggleGroup>
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
            <Tooltip>
              <TooltipTrigger render={<span className="flex" />}>
                <Button disabled>{t("send")}</Button>
              </TooltipTrigger>
              <TooltipContent>{soon}</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Who handles the report and where it stands (Figma AD-BL2 › Card · Xử lý). Choosing "Đã xong" opens the dialog
 * that closes it; giving it to an admin waits for its backend.
 */
function Handling({ issue, onDone }: { issue: AdminIssue; onDone: () => void }) {
  const t = useTranslations("admin.issues");
  const id = useId();
  const statusOptions = issueStatuses.map((status) => ({
    value: status,
    label: t(`status.${status}`),
  }));
  const handlerOptions = [
    { value: "", label: t("unassigned") },
    ...issue.handlers.map((handler) => ({ value: handler.id, label: handler.name })),
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>{t("detail.handling")}</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {/* A combobox takes no name from what it holds, so each select is named by its label. */}
          <Select
            value={issue.status}
            items={statusOptions}
            onValueChange={(status) => {
              if ((status as IssueStatus) === "done" && issue.status !== "done") onDone();
            }}
          >
            <SelectTrigger aria-labelledby={`${id}-status`} className="w-full">
              <span id={`${id}-status`} className="text-muted-foreground">
                {t("detail.status")}:
              </span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} align="start">
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Tooltip>
            <TooltipTrigger render={<span className="flex" />}>
              <Select value={issue.handler?.id ?? ""} items={handlerOptions} disabled>
                <SelectTrigger aria-labelledby={`${id}-handler`} className="w-full">
                  <span id={`${id}-handler`} className="text-muted-foreground">
                    {t("detail.handler")}:
                  </span>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false} align="start">
                  {handlerOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TooltipTrigger>
            <TooltipContent>{t("soon")}</TooltipContent>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  );
}

/** The order the report is about (Figma AD-BL2 › Card · Liên quan): its number, store, item, amount, payment, pickup. */
function RelatedOrder({ order }: { order: NonNullable<AdminIssue["order"]> }) {
  const t = useTranslations("admin.issues.detail");
  const format = useFormatter();
  const method = t(`paymentMethod.${order.payment.method}`);
  const link = buttonVariants({ variant: "link", size: "inline" });
  const facts = [
    {
      term: t("order"),
      value: (
        <Link href={adminHref("orderDetail", { orderId: order.id })} className={link}>
          #{order.code}
        </Link>
      ),
    },
    {
      term: t("store"),
      value: (
        <Link href={adminHref("sellerDetail", { sellerId: order.sellerId })} className={link}>
          {order.sellerName}
        </Link>
      ),
    },
    { term: t("item"), value: order.item },
    { term: t("amount"), value: formatPrice(order.amountVnd) },
    {
      term: t("payment"),
      value: order.payment.paid ? t("paid", { method }) : t("unpaid", { method }),
    },
    ...(order.collectedAt
      ? [
          {
            term: t("collectedAt"),
            value: `${format.dateTime(new Date(order.collectedAt), "day")} · ${format.dateTime(new Date(order.collectedAt), "time")}`,
          },
        ]
      : []),
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>{t("related")}</h2>
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
  );
}
