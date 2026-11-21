import { useTranslations } from "next-intl";

import { formatCost } from "./format";

/** formatCost with the words of the page's language, for a component that is not async. */
export function usePrice(): (amount: number) => string {
  const t = useTranslations("Price");
  return (amount) => formatCost(amount, t("free"));
}
