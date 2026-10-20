import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

// The search field of the header (Figma search): a GET form over the address, so a search can be shared
// and works before JavaScript. Off the home, `action` sends the search to the home.
export function SearchField({
  value,
  id = "offer-search",
  action,
}: {
  value?: string;
  id?: string;
  action?: string;
}) {
  const t = useTranslations("Home");

  return (
    <search>
      <form action={action}>
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
