import { SearchIcon, Settings2Icon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Link } from "@/i18n/navigation";

// The search field of the header (Figma search): a GET form to the search page (Figma K2), so a search can
// be shared and works before JavaScript. Its round button opens the search with its filters (Figma nút lọc).
export function SearchField({
  value,
  near,
  id = "offer-search",
}: {
  value?: string;
  /** The place the home is showing, kept by the search. */
  near?: string;
  id?: string;
}) {
  const t = useTranslations("Home");
  const locale = useLocale();

  return (
    <search>
      <form action={`/${locale}/search`}>
        {near && <input type="hidden" name="near" value={near} />}
        <InputGroup surface="header">
          <InputGroupInput
            id={id}
            name="q"
            type="search"
            defaultValue={value}
            aria-label={t("searchLabel")}
            placeholder={t("searchPlaceholder")}
          />
          <InputGroupAddon>
            <SearchIcon aria-hidden className="size-5" />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Link
              href={{ pathname: "/search", query: near ? { near } : {} }}
              aria-label={t("filters")}
              className="flex size-9 items-center justify-center rounded-full bg-secondary text-primary transition-colors hover:bg-secondary-hover focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <Settings2Icon aria-hidden className="size-5" />
            </Link>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </search>
  );
}
