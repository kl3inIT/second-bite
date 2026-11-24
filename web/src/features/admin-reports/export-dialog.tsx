"use client";

import {
  CalendarClockIcon,
  DownloadIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  SheetIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";

import { ChoiceOption } from "@/components/choice-option";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { RadioGroup } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Link } from "@/i18n/navigation";

import { reportParts, serializeReportPrint, type ReportPart } from "./search-params";

type Format = "pdf" | "xlsx" | "shifts" | "csv";

/**
 * "Xuất báo cáo" (report-products-export increment): a dialog that chooses a PDF, an Excel workbook, the workbook by
 * shift for the sponsor with each order's customer (#261) or the CSV for the report's days and store. The PDF is the
 * print page with the parts ticked, which the browser saves as a PDF; the others are the server's files. Each is a
 * link, so it works as soon as it is drawn.
 */
export function ExportDialog({
  range,
  storeName,
  filter,
  csvHref,
  workbookHref,
  shiftsHref,
}: {
  range: string;
  storeName: string | undefined;
  filter: {
    from: Date | null;
    to: Date | null;
    store: string | null;
    timeFrom: string | null;
    timeUntil: string | null;
  };
  csvHref: string;
  workbookHref: string;
  shiftsHref: string;
}) {
  const t = useTranslations("Admin.reports.exportDialog");
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<Format>("pdf");
  const [parts, setParts] = useState<ReportPart[]>([...reportParts]);
  const [compare, setCompare] = useState(true);
  const id = useId();
  const printHref = `/admin/reports/print${serializeReportPrint({ ...filter, parts, compare })}`;
  const fileHref = { xlsx: workbookHref, shifts: shiftsHref, csv: csvHref };

  return (
    <>
      <Button size="lg" onClick={() => setOpen(true)}>
        <DownloadIcon data-icon="inline-start" />
        {t("action")}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription>
              {t("scope", { range, store: storeName ?? t("anyStore") })}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <p id={`${id}-format`} className="text-body-sm-strong text-foreground">
                {t("format")}
              </p>
              <RadioGroup
                value={format}
                onValueChange={(value) => setFormat(value as Format)}
                aria-labelledby={`${id}-format`}
                className="sm:grid-cols-2"
              >
                <ChoiceOption
                  value="pdf"
                  icon={FileTextIcon}
                  title={t("pdf")}
                  hint={t("pdfHint")}
                />
                <ChoiceOption
                  value="xlsx"
                  icon={SheetIcon}
                  title={t("xlsx")}
                  hint={t("xlsxHint")}
                />
                <ChoiceOption
                  value="shifts"
                  icon={CalendarClockIcon}
                  title={t("shifts")}
                  hint={t("shiftsHint")}
                />
                <ChoiceOption
                  value="csv"
                  icon={FileSpreadsheetIcon}
                  title={t("csv")}
                  hint={t("csvHint")}
                />
              </RadioGroup>
            </div>
            {format === "pdf" && (
              <>
                <fieldset className="flex flex-col gap-2">
                  <legend className="mb-2 text-body-sm-strong text-foreground">{t("parts")}</legend>
                  <div className="grid gap-x-4 gap-y-1 sm:grid-cols-2">
                    {reportParts.map((part) => (
                      <label
                        key={part}
                        htmlFor={`${id}-${part}`}
                        className="flex min-h-11 items-center gap-2 text-body-sm"
                      >
                        <Checkbox
                          id={`${id}-${part}`}
                          checked={parts.includes(part)}
                          onCheckedChange={(checked: boolean) =>
                            setParts(
                              checked
                                ? reportParts.filter((p) => p === part || parts.includes(p))
                                : parts.filter((p) => p !== part),
                            )
                          }
                        />
                        {t(`part.${part}`)}
                      </label>
                    ))}
                  </div>
                  {parts.length === 0 && (
                    <p className="text-label text-destructive">{t("noParts")}</p>
                  )}
                </fieldset>
                <Field orientation="horizontal">
                  <Switch
                    id={`${id}-compare`}
                    checked={compare}
                    onCheckedChange={(checked: boolean) => setCompare(checked)}
                  />
                  <FieldLabel htmlFor={`${id}-compare`}>{t("compare")}</FieldLabel>
                </Field>
              </>
            )}
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" size="lg" />}>{t("cancel")}</DialogClose>
            {format !== "pdf" ? (
              // A plain download: the server answers the file and its name, under the session's cookie.
              <a
                href={fileHref[format]}
                download
                className={buttonVariants({ size: "lg" })}
                onClick={() => setOpen(false)}
              >
                {t("go")}
              </a>
            ) : parts.length === 0 ? (
              <Button size="lg" disabled>
                {t("go")}
              </Button>
            ) : (
              <Link href={printHref} className={buttonVariants({ size: "lg" })}>
                {t("go")}
              </Link>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
