import { MapPinIcon } from "lucide-react";
import { useTranslations } from "next-intl";

// The page's title on the header (Figma header › location): a lime pin, the place in bold and its district
// below in the soft text for Tasco blue.
// A reader hears "Tối nay ở Tasco Mall"; the first words are only for them.
export function PlaceHeading() {
  const t = useTranslations("Home");

  return (
    <div className="flex gap-2 pt-0.75">
      <MapPinIcon aria-hidden strokeWidth={2.2} className="size-4.5 shrink-0 text-fresh" />
      <div className="flex flex-col">
        <h1 className="text-title">
          {t.rich("title", { hidden: (chunks) => <span className="sr-only">{chunks}</span> })}
        </h1>
        <p className="text-label text-inverse-muted">{t("area")}</p>
      </div>
    </div>
  );
}
