import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

// The search field of the header (Figma search): a GET form over the address, so a search can be shared
// and works before JavaScript.
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

  return (
    <search>
      <form>
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
        </InputGroup>
      </form>
    </search>
  );
}
