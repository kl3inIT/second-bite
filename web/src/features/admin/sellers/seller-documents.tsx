"use client";

import { EyeIcon, FileCheckIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import { AdminBadge, type BadgeTone } from "@/features/admin/ui/badge";
import { DataTable, StrongCell, TextCell } from "@/features/admin/ui/data-table";
import { EmptyState } from "@/features/admin/ui/empty-state";

import type { DocumentStatus, SellerDocument } from "./documents-source";

const tones: Record<DocumentStatus, BadgeTone> = {
  valid: "success",
  expiring: "warning",
  missing: "error",
};

/**
 * A store's documents tab (Figma AD-QD5): each document with its number, when it was issued and runs out, whether
 * it holds and its file. Empty until the backend keeps documents (documents-source.ts).
 */
export function SellerDocuments({ documents }: { documents: SellerDocument[] }) {
  const t = useTranslations("admin.sellers.detail.documents");
  const format = useFormatter();
  const day = (value: string | undefined, none: string) =>
    value ? format.dateTime(new Date(`${value}T00:00:00+07:00`), "day") : none;

  // An empty table scrolls sideways on a phone with nothing to focus in it, so the card stands alone.
  if (documents.length === 0) {
    return (
      <div className="rounded-md border border-border bg-card">
        <EmptyState title={t("empty")} icon={FileCheckIcon} />
      </div>
    );
  }

  return (
    <DataTable
      caption={t("caption")}
      rows={documents}
      rowKey={(document) => document.id}
      columns={[
        {
          key: "name",
          header: t("columns.name"),
          grow: true,
          cell: (document) => <StrongCell>{document.name}</StrongCell>,
        },
        {
          key: "number",
          header: t("columns.number"),
          cell: (document) => <TextCell>{document.number ?? "—"}</TextCell>,
        },
        {
          key: "issued",
          header: t("columns.issued"),
          cell: (document) => <TextCell>{day(document.issuedOn, "—")}</TextCell>,
        },
        {
          key: "expires",
          header: t("columns.expires"),
          cell: (document) => (
            <TextCell>
              {document.status === "missing" ? "—" : day(document.expiresOn, t("noExpiry"))}
            </TextCell>
          ),
        },
        {
          key: "status",
          header: t("columns.status"),
          cell: (document) => (
            <AdminBadge tone={tones[document.status]}>{t(`status.${document.status}`)}</AdminBadge>
          ),
        },
        {
          key: "file",
          header: t("columns.file"),
          cell: (document) =>
            document.fileUrl ? (
              <a
                href={document.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-sm text-body-sm-strong text-primary hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <EyeIcon aria-hidden className="size-4" />
                {t("view")}
                <span className="sr-only">{document.name}</span>
              </a>
            ) : (
              <TextCell>{t("noFile")}</TextCell>
            ),
        },
      ]}
    />
  );
}
