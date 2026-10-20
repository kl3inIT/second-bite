import { ChevronDownIcon, MapPinIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { AreaSheet } from "./area-sheet";
import { homeSearch, type HomeQuery } from "./home-query";

// The page's title on the header (Figma header › location): a lime pin, the place in bold and its district
// below in the soft text for Tasco blue, Tasco Mall or the person's own place. The whole of it opens the
// area sheet. A reader hears "Tối nay ở Tasco Mall"; the first words are only for them.
export function PlaceHeading({ query = {} }: { query?: HomeQuery }) {
  const t = useTranslations("Home");
  const { near, ...rest } = query;

  return (
    <div className="relative flex gap-2 pt-0.75">
      <MapPinIcon aria-hidden strokeWidth={2.2} className="size-4.5 shrink-0 text-fresh" />
      <div className="flex flex-col">
        <h1 className="flex items-center gap-1 text-title">
          <span>
            {t.rich(near ? "titleNearby" : "title", {
              hidden: (chunks) => <span className="sr-only">{chunks}</span>,
            })}
          </span>
          <ChevronDownIcon aria-hidden className="size-4 shrink-0" />
        </h1>
        <p className="text-label text-inverse-muted">{near ? t("areaNearby") : t("area")}</p>
      </div>
      <AreaSheet nearby={Boolean(near)} keep={homeSearch(rest)} className="absolute -inset-1" />
    </div>
  );
}
