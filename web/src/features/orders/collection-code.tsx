import { useTranslations } from "next-intl";

/**
 * The four-digit collection code, large, for the counter (Figma W3): shown to its customer once the order is
 * ready or its window has opened, and read out digit by digit by a screen reader.
 */
export function CollectionCode({ code }: { code: string }) {
  const t = useTranslations("Orders");

  return (
    <section
      aria-labelledby="collection-code"
      className="flex flex-col items-center gap-2 rounded-2xl bg-card p-6 text-center text-card-foreground"
    >
      <h2 id="collection-code" className="text-body-sm-strong text-muted-foreground">
        {t("code")}
      </h2>
      <p
        aria-label={code.split("").join(" ")}
        className="font-display text-display tracking-widest text-foreground"
      >
        {code}
      </p>
      <p className="text-body-sm text-muted-foreground">{t("codeHint")}</p>
    </section>
  );
}
