import { CircleAlertIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/** What a screen shows of a failed request: `failureOf(error)`, or nothing known when no answer came. */
export type Failure = { detail?: string; reference?: string };

/**
 * A failed request said in place, above a form or under an action: the server's sentence, or the
 * screen's `fallback` when no answer came, then the reference a person quotes to report it
 * (docs/guidelines/web.md › Data and the backend). `title` says what did not happen, when the
 * sentence alone would not.
 */
export function FailureAlert({
  failure,
  fallback,
  title,
}: {
  failure: Failure;
  fallback: string;
  title?: string;
}) {
  const t = useTranslations("Failure");
  return (
    <Alert variant="destructive">
      <CircleAlertIcon aria-hidden />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>
        {failure.detail ?? fallback}
        {failure.reference && ` (${t("reference", { reference: failure.reference })})`}
      </AlertDescription>
    </Alert>
  );
}
