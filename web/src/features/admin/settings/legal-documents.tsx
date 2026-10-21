"use client";

import {
  BoldIcon,
  CircleCheckIcon,
  ClockIcon,
  EyeIcon,
  FilePlusIcon,
  FileTextIcon,
  Heading2Icon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  type LucideIcon,
} from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

import { AdminBadge, type BadgeTone } from "../ui/badge";
import { DataTable, StrongCell, TextCell } from "../ui/data-table";
import { EmptyState } from "../ui/empty-state";
import { RowActionMenu } from "../ui/row-action-menu";
import type { LegalDocument, LegalDraft, LegalStatus } from "./legal-source";
import { TextField } from "./text-field";

const statuses: Record<LegalStatus, { tone: BadgeTone; icon: LucideIcon }> = {
  active: { tone: "success", icon: CircleCheckIcon },
  draft: { tone: "neutral", icon: ClockIcon },
  replaced: { tone: "neutral", icon: ClockIcon },
};

/**
 * The legal content (Figma AD-CD6): every version of the terms, the privacy policy and the store rules with the day
 * it takes effect and whether it applies, then the draft being written. Nothing can be saved or published until
 * legal content has a backend; those buttons say "Sắp có".
 */
export function LegalDocuments({
  documents,
  draft,
}: {
  documents: LegalDocument[];
  draft: LegalDraft | null;
}) {
  const t = useTranslations("admin.settings.legal");
  const soon = useTranslations("admin.shell")("soon");
  const format = useFormatter();

  return (
    <div className="flex flex-col gap-5">
      <DataTable
        caption={t("caption")}
        rows={documents}
        rowKey={(row) => row.id}
        empty={<EmptyState icon={FileTextIcon} title={t("empty")} />}
        columns={[
          {
            key: "kind",
            header: t("columns.document"),
            grow: true,
            cell: (row) => (
              <span className="flex items-center gap-3">
                <FileTextIcon aria-hidden className="size-5 shrink-0 text-primary" />
                <StrongCell>
                  {t("versionOf", { name: t(`kinds.${row.kind}`), version: row.version })}
                </StrongCell>
              </span>
            ),
          },
          {
            key: "effectiveFrom",
            header: t("columns.effectiveFrom"),
            cell: (row) => (
              <TextCell>
                {row.effectiveFrom
                  ? format.dateTime(new Date(row.effectiveFrom), "day")
                  : t("noDay")}
              </TextCell>
            ),
          },
          {
            key: "status",
            header: t("columns.status"),
            cell: (row) => (
              <AdminBadge tone={statuses[row.status].tone} icon={statuses[row.status].icon}>
                {t(`statuses.${row.status}`)}
              </AdminBadge>
            ),
          },
          {
            key: "actions",
            header: "",
            align: "end",
            cell: (row) => (
              <RowActionMenu
                name={t("versionOf", { name: t(`kinds.${row.kind}`), version: row.version })}
                actions={[
                  { label: `${t("view")} · ${soon}`, icon: EyeIcon, disabled: true },
                  { label: `${t("copy")} · ${soon}`, icon: FilePlusIcon, disabled: true },
                ]}
              />
            ),
          },
        ]}
      />
      {draft && <DraftEditor draft={draft} />}
    </div>
  );
}

// The draft being written (Figma AD-CD6 › Soạn thảo): its words, the day it takes effect and whether people agree
// again. The words can be edited here, but neither kept nor published until there is a backend.
function DraftEditor({ draft }: { draft: LegalDraft }) {
  const t = useTranslations("admin.settings.legal");
  const soon = useTranslations("admin.shell")("soon");
  const format = useFormatter();
  const [body, setBody] = useState(draft.body);
  const [effectiveFrom, setEffectiveFrom] = useState(draft.effectiveFrom ?? "");
  const [reconsent, setReconsent] = useState(draft.reconsent);
  const tools = [
    { label: t("tools.heading"), icon: Heading2Icon },
    { label: t("tools.bold"), icon: BoldIcon },
    { label: t("tools.italic"), icon: ItalicIcon },
    { label: t("tools.list"), icon: ListIcon },
    { label: t("tools.link"), icon: LinkIcon },
  ];

  return (
    <section
      aria-labelledby="legal-draft-title"
      className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <h3 id="legal-draft-title" className="text-title text-foreground">
          {t("draftTitle", { name: t(`kinds.${draft.kind}`), version: draft.version })}
        </h3>
        {draft.savedAt && (
          <AdminBadge tone="neutral">
            {t("draftSaved", { time: format.dateTime(new Date(draft.savedAt), "time") })}
          </AdminBadge>
        )}
      </div>
      <div
        role="toolbar"
        aria-label={t("tools.label")}
        className="flex gap-1 border-y border-border bg-muted px-3 py-1"
      >
        {tools.map(({ label, icon: Icon }) => (
          <Button key={label} variant="ghost" size="icon" disabled title={soon} aria-label={label}>
            <Icon aria-hidden />
          </Button>
        ))}
      </div>
      <div className="px-5 py-4">
        <Textarea
          aria-label={t("body")}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={8}
        />
      </div>
      <div className="flex flex-wrap items-end gap-4 border-t border-border px-5 py-4">
        <div className="w-full sm:w-48">
          <TextField
            id="legal-effective-from"
            label={t("columns.effectiveFrom")}
            type="date"
            value={effectiveFrom}
            onChange={setEffectiveFrom}
          />
        </div>
        <label className="flex min-h-11 items-center gap-2 text-body-sm text-foreground">
          <Checkbox checked={reconsent} onCheckedChange={setReconsent} />
          {t("reconsent")}
        </label>
        <div className="ml-auto flex gap-3">
          <Button variant="outline" disabled title={soon}>
            {t("saveDraft")}
          </Button>
          <Button disabled title={soon}>
            {t("publish")}
          </Button>
        </div>
      </div>
    </section>
  );
}
