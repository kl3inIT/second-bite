import { ApiError } from "@/lib/api/client";

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

/** The reference a person reports for a failure, when the backend answered with one. */
export function referenceOf(error: unknown): string | undefined {
  return error instanceof ApiError ? error.requestId : undefined;
}
