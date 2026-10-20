import { MapPinIcon } from "lucide-react";
import { useTranslations } from "next-intl";

// The page's title on the header (Figma header › location): a lime pin, the place in bold and its district
// below in the soft text for Tasco blue.
// A reader hears "Tối nay ở Tasco Mall"; the first words are only for them. A page with a heading of its own
// (the order pages) shows the place without making it the page's heading.
export function PlaceHeading({ asHeading = true }: { asHeading?: boolean }) {
  const t = useTranslations("Home");
  const Title = asHeading ? "h1" : "p";

  return (
    <div className="flex gap-2 pt-0.75">
      <MapPinIcon aria-hidden strokeWidth={2.2} className="size-4.5 shrink-0 text-fresh" />
      <div className="flex flex-col">
        <Title className="text-title">
          {t.rich("title", { hidden: (chunks) => <span className="sr-only">{chunks}</span> })}
        </Title>
        <p className="text-label text-inverse-muted">{t("area")}</p>
      </div>
    </div>
  );
}
