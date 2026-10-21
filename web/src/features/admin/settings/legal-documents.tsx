"use client";

import {
  BoldIcon,
  CircleCheckIcon,
  ClockIcon,
  EllipsisIcon,
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
import { type ReactElement, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import type { LegalDocument, LegalDraft, LegalStatus } from "./legal-source";

// Each status on the shared Badge's own variants, with its icon and words, never colour alone.
const statuses: Record<LegalStatus, { variant: "fresh" | "outline"; icon: LucideIcon }> = {
  active: { variant: "fresh", icon: CircleCheckIcon },
  draft: { variant: "outline", icon: ClockIcon },
  replaced: { variant: "outline", icon: ClockIcon },
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
  const shell = useTranslations("admin.shell");
  const soon = shell("soon");
  const format = useFormatter();

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <Table>
          <caption className="sr-only">{t("caption")}</caption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-full">{t("columns.document")}</TableHead>
              <TableHead>{t("columns.effectiveFrom")}</TableHead>
              <TableHead>{t("columns.status")}</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((row) => {
              const name = t("versionOf", { name: t(`kinds.${row.kind}`), version: row.version });
              const { variant, icon: Icon } = statuses[row.status];
              return (
                <TableRow key={row.id}>
                  <TableCell className="w-full">
                    <span className="flex items-center gap-3">
                      <FileTextIcon aria-hidden className="size-5 shrink-0 text-primary" />
                      <span className="block max-w-80 truncate text-body-sm-strong text-foreground">
                        {name}
                      </span>
                    </span>
                  </TableCell>
                  <TableCell>
                    {row.effectiveFrom
                      ? format.dateTime(new Date(row.effectiveFrom), "day")
                      : t("noDay")}
                  </TableCell>
                  <TableCell>
                    <Badge variant={variant}>
                      <Icon aria-hidden />
                      {t(`statuses.${row.status}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={shell("rowActions", { name })}
                          />
                        }
                      >
                        <EllipsisIcon aria-hidden />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuItem disabled>
                            <EyeIcon aria-hidden />
                            {`${t("view")} · ${soon}`}
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled>
                            <FilePlusIcon aria-hidden />
                            {`${t("copy")} · ${soon}`}
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {documents.length === 0 && (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileTextIcon aria-hidden />
              </EmptyMedia>
              <EmptyTitle>{t("empty")}</EmptyTitle>
            </EmptyHeader>
          </Empty>
        )}
      </Card>
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

  // A button whose backend does not exist yet: off, with "Sắp có" under the pointer and on focus.
  function soonButton(key: string, button: ReactElement) {
    return (
      <Tooltip key={key}>
        <TooltipTrigger render={<span />}>{button}</TooltipTrigger>
        <TooltipContent>{soon}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <section aria-labelledby="legal-draft-title">
      <Card>
        <CardHeader>
          <CardTitle>
            <h3 id="legal-draft-title">
              {t("draftTitle", { name: t(`kinds.${draft.kind}`), version: draft.version })}
            </h3>
          </CardTitle>
          {draft.savedAt && (
            <CardAction>
              <Badge variant="outline">
                <ClockIcon aria-hidden />
                {t("draftSaved", { time: format.dateTime(new Date(draft.savedAt), "time") })}
              </Badge>
            </CardAction>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div role="toolbar" aria-label={t("tools.label")} className="flex gap-1">
              {tools.map(({ label, icon: Icon }) =>
                soonButton(
                  label,
                  <Button variant="ghost" size="icon" disabled aria-label={label}>
                    <Icon aria-hidden />
                  </Button>,
                ),
              )}
            </div>
            <Textarea
              aria-label={t("body")}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={8}
            />
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex w-full flex-wrap items-end gap-4">
            <Field className="w-full sm:w-48">
              <FieldLabel htmlFor="legal-effective-from">{t("columns.effectiveFrom")}</FieldLabel>
              <Input
                id="legal-effective-from"
                type="date"
                value={effectiveFrom}
                onChange={(event) => setEffectiveFrom(event.target.value)}
              />
            </Field>
            <Field orientation="horizontal" className="w-auto">
              <Checkbox
                id="legal-reconsent"
                checked={reconsent}
                onCheckedChange={(checked) => setReconsent(checked)}
              />
              <FieldLabel htmlFor="legal-reconsent">{t("reconsent")}</FieldLabel>
            </Field>
            <div className="ml-auto flex gap-3">
              {soonButton(
                "saveDraft",
                <Button variant="outline" disabled>
                  {t("saveDraft")}
                </Button>,
              )}
              {soonButton("publish", <Button disabled>{t("publish")}</Button>)}
            </div>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
}
