import { useTranslations } from "next-intl";

// What Second Bite is, kept in view on a wide screen: one line and the three steps; a phone follows Figma K1,
// which goes straight from the kinds to the dishes. A first visit learns it without a landing page (SEC-23),
// and it never needs closing (docs/research/2026-10-19-desktop-home.md).
export function HowItWorks() {
  const t = useTranslations("Intro");
  const steps = [t("step1"), t("step2"), t("step3")];

  return (
    <section
      aria-labelledby="how-it-works"
      className="hidden flex-wrap items-center justify-between gap-x-8 gap-y-3 py-1 md:flex"
    >
      <h2 id="how-it-works" className="text-title text-foreground">
        {t("tagline")}
      </h2>
      <ol className="flex gap-6">
        {steps.map((step, index) => (
          <li key={step} className="flex items-center gap-2">
            <span
              aria-hidden
              className="flex size-6 items-center justify-center rounded-full bg-fresh text-figure-sm text-fresh-foreground"
            >
              {index + 1}
            </span>
            <span className="text-body-sm text-muted-foreground">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
