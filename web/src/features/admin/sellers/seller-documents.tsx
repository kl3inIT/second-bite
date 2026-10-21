"use client";

import { EyeIcon, FileCheckIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { DocumentStatus, SellerDocument } from "./documents-source";
import { type BadgeTone, toneBadge, toneIcon } from "./seller-list";

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
      <Empty surface="card">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileCheckIcon aria-hidden />
          </EmptyMedia>
          <EmptyTitle>{t("empty")}</EmptyTitle>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <Card>
      <Table>
        <caption className="sr-only">{t("caption")}</caption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-full">{t("columns.name")}</TableHead>
            <TableHead>{t("columns.number")}</TableHead>
            <TableHead>{t("columns.issued")}</TableHead>
            <TableHead>{t("columns.expires")}</TableHead>
            <TableHead>{t("columns.status")}</TableHead>
            <TableHead>{t("columns.file")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document) => {
            const tone = tones[document.status];
            const Icon = toneIcon[tone];
            return (
              <TableRow key={document.id}>
                <TableCell className="w-full">
                  <span className="text-body-sm-strong">{document.name}</span>
                </TableCell>
                <TableCell>{document.number ?? "—"}</TableCell>
                <TableCell>{day(document.issuedOn, "—")}</TableCell>
                <TableCell>
                  {document.status === "missing" ? "—" : day(document.expiresOn, t("noExpiry"))}
                </TableCell>
                <TableCell>
                  <Badge variant={toneBadge[tone]}>
                    <Icon aria-hidden />
                    {t(`status.${document.status}`)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {document.fileUrl ? (
                    <a
                      href={document.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={buttonVariants({ variant: "link" })}
                    >
                      <EyeIcon aria-hidden />
                      {t("view")}
                      <span className="sr-only">{document.name}</span>
                    </a>
                  ) : (
                    t("noFile")
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
