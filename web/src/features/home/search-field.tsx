import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";

// The search field of the header (Figma search): a GET form over the address, so a search can be shared
// and works before JavaScript. On the green shell its focus ring is amber, the colour that reads there.
export function SearchField({ value }: { value?: string }) {
  const t = useTranslations("Home");

  return (
    <search>
      <form className="flex h-12 items-center gap-2.5 rounded-field bg-card pr-1.5 pl-3.5 text-card-foreground focus-within:ring-3 focus-within:ring-highlight">
        <label htmlFor="offer-search" className="sr-only">
          {t("searchLabel")}
        </label>
        <SearchIcon aria-hidden className="size-5 shrink-0 text-muted-foreground" />
        <input
          id="offer-search"
          name="q"
          type="search"
          defaultValue={value}
          placeholder={t("searchPlaceholder")}
          className="h-full min-w-0 flex-1 bg-transparent text-body-14 placeholder:text-muted-foreground focus-visible:outline-none"
        />
      </form>
    </search>
  );
}
