import { MapPinIcon } from "lucide-react";
import { useTranslations } from "next-intl";

// The page's title on the header (Figma header › location): the place in bold with its district below.
// A reader hears "Tối nay ở Tasco Mall"; the first words are only for them.
export function PlaceHeading() {
  const t = useTranslations("Home");

  return (
    <div className="flex gap-2 pt-0.75">
      <MapPinIcon aria-hidden strokeWidth={2.2} className="size-4.5 shrink-0" />
      <div className="flex flex-col">
        <h1 className="text-place-16">
          {t.rich("title", { hidden: (chunks) => <span className="sr-only">{chunks}</span> })}
        </h1>
        <p className="text-caption-12 text-soft-foreground">{t("area")}</p>
      </div>
    </div>
  );
}
