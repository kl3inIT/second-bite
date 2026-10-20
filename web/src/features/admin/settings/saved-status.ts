import { useFormatter, useTranslations } from "next-intl";

/**
 * The foot of a settings form when nothing is changed (Figma Admin/FormFooter): "Cập nhật lần cuối lúc 09:15,
 * 18/10/2026", or "Chưa lưu lần nào". The API does not say who saved in words, so the line names no one.
 */
export function useSavedStatus(updatedAt: string | undefined): string {
  const t = useTranslations("admin.settings.form");
  const format = useFormatter();
  if (!updatedAt) return t("neverSaved");
  const at = new Date(updatedAt);
  return t("updated", { time: format.dateTime(at, "time"), day: format.dateTime(at, "day") });
}
