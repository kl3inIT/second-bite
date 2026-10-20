import { useFormatter, useLocale, useTranslations } from "next-intl";

import { formatDayMonth } from "@/i18n/day-month";

/** "21:14, 20/10": when a payment or a request happened, as the tables write it (AD-HT1, AD-HT3). */
export function useWhen(): (at: string) => string {
  const t = useTranslations("admin.payments");
  const format = useFormatter();
  const locale = useLocale();
  return (at) => {
    const date = new Date(at);
    return t("at", { time: format.dateTime(date, "time"), day: formatDayMonth(date, locale) });
  };
}
