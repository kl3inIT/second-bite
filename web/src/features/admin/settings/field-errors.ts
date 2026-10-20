import { ApiError, failureOf } from "@/lib/api/client";

/**
 * What a refused save says about the form (docs: admin-web-flow › Lỗi ở form): the fields the backend points at
 * (`errors[].pointer`, "#/windowMinMinutes"), when the failure is `code` or a request the backend could not
 * accept; otherwise nothing at a field, and the page says it in a toast with the request's reference.
 */
export function refusedFields<Field extends string>(
  error: unknown,
  code: string,
  fields: readonly Field[],
): Field[] {
  if (!(error instanceof ApiError) || error.status !== 400) return [];
  if (error.code !== code && !error.code?.startsWith("PLATFORM_")) return [];
  const named = error.violations.map((violation) => violation.pointer?.replace(/^#\//, ""));
  return fields.filter((field) => named.includes(field));
}

/** The words a page's toast says of a refused save. */
type RefusalWords = {
  failed: string;
  failedWithReference: (reference: string) => string;
  reference: (reference: string) => string;
};

/**
 * What the toast says of a refused save (SEC-28): the server's sentence, written in the page's language, with
 * the reference a person reports; the form's own words only when no answer came or it carried no sentence.
 */
export function refusalSentence(error: unknown, words: RefusalWords): string {
  const { detail, reference } = failureOf(error);
  if (detail) return reference ? `${detail} ${words.reference(reference)}` : detail;
  return reference ? words.failedWithReference(reference) : words.failed;
}
