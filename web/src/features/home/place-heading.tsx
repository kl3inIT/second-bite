import { ChevronDownIcon, MapPinIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { AreaSheet } from "./area-sheet";
import type { HomeQuery } from "./home-query";

// The page's title on the header (Figma header › location): a lime pin, the place in bold and its district
// below in the soft text for Tasco blue, every shop or the person's own place. The whole of it opens the
// area sheet. A reader hears "Tối nay: Tất cả quán"; the first words are only for them. A page with a heading
// of its own (the order pages) shows the place without making it the page's heading.
export function PlaceHeading({
  query = {},
  asHeading = true,
}: {
  query?: HomeQuery;
  asHeading?: boolean;
}) {
  const t = useTranslations("Home");
  const Title = asHeading ? "h1" : "p";
  const { near, ...rest } = query;

  return (
    <div className="relative flex gap-2 pt-0.75">
      <MapPinIcon aria-hidden strokeWidth={2.2} className="size-4.5 shrink-0 text-fresh" />
      <div className="flex flex-col">
        <Title className="flex items-center gap-1 text-title">
          <span>
            {t.rich(near ? "titleNearby" : "title", {
              hidden: (chunks) => <span className="sr-only">{chunks}</span>,
            })}
          </span>
          <ChevronDownIcon aria-hidden className="size-4 shrink-0" />
        </Title>
        <p className="text-label text-inverse-muted">{near ? t("areaNearby") : t("area")}</p>
      </div>
      <AreaSheet nearby={Boolean(near)} keep={rest} className="absolute -inset-1" />
    </div>
  );
}
