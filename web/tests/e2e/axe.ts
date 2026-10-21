// Adapted from BeyondPilot's web/tests/e2e/axe.ts.
import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

async function seriousViolations(page: Page, exclude: string[]) {
  const builder = new AxeBuilder({ page }).withTags([
    "wcag2a",
    "wcag2aa",
    "wcag21a",
    "wcag21aa",
    "wcag22aa",
  ]);
  for (const selector of exclude) builder.exclude(selector);
  // A colour read halfway through a transition (a drawer fading in, a button turning blue) is no colour the
  // person ends up seeing, so the scan waits until the page's animations are over.
  await page.evaluate(() =>
    Promise.all(
      document.getAnimations().map((animation) => animation.finished.catch(() => undefined)),
    ),
  );
  const results = await builder.analyze();
  return results.violations.filter(
    (violation) => violation.impact === "serious" || violation.impact === "critical",
  );
}

// Fails on any serious or critical WCAG 2.2 A/AA finding; no rule is excluded. `exclude` names, by selector,
// the few elements that are decoration only and hidden from assistive technology (`data-decorative`): the
// sign-in screen's side panel, whose headline is white on Tasco sky (2.4:1) as Figma L6 draws it, and which
// repeats what the form's heading says.
export async function expectNoSeriousA11yViolations(
  page: Page,
  { exclude = [] }: { exclude?: string[] } = {},
) {
  let serious = await seriousViolations(page, exclude);
  // Next.js takes the <title> out of the head and puts it back each time a client navigation
  // lands (measured: a gap of a few milliseconds). A page read in that gap has no title, so a
  // finding of that rule is read once more, with the title awaited; a page that really has none
  // fails the wait.
  if (serious.some((violation) => violation.id === "document-title")) {
    await expect(page).toHaveTitle(/\S/);
    serious = await seriousViolations(page, exclude);
  }
  // A finding of colour contrast is read once more too: a list that has just been filtered fades in after the
  // first wait began, and 4.3:1 was measured on text at a fraction of its way to its colour. A colour that
  // really falls short is still short at the second reading.
  if (serious.some((violation) => violation.id === "color-contrast")) {
    await page.waitForTimeout(500);
    serious = await seriousViolations(page, exclude);
  }
  expect(serious, serious.map((violation) => violation.id).join(", ")).toEqual([]);
}
