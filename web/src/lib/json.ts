import type { z } from "zod";

/**
 * The value in a JSON text when it is what the schema describes; undefined when the text is not JSON or holds
 * something else. Text from outside (browser storage, a cookie, a token) is parsed here, at the point it arrives,
 * and nowhere else (docs/guidelines/web.md › Data from outside).
 */
export function parseJson<T>(text: string, schema: z.ZodType<T>): T | undefined {
  try {
    const parsed = schema.safeParse(JSON.parse(text));
    return parsed.success ? parsed.data : undefined;
  } catch {
    return undefined;
  }
}
