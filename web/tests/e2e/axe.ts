// Adapted from BeyondPilot's web/tests/e2e/axe.ts.
import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

async function seriousViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  return results.violations.filter(
    (violation) => violation.impact === "serious" || violation.impact === "critical",
  );
}

// Fails on any serious or critical WCAG 2.2 A/AA finding; no rule is excluded.
export async function expectNoSeriousA11yViolations(page: Page) {
  let serious = await seriousViolations(page);
  // Next.js takes the <title> out of the head and puts it back each time a client navigation
  // lands (measured: a gap of a few milliseconds). A page read in that gap has no title, so a
  // finding of that rule is read once more, with the title awaited; a page that really has none
  // fails the wait.
  if (serious.some((violation) => violation.id === "document-title")) {
    await expect(page).toHaveTitle(/\S/);
    serious = await seriousViolations(page);
  }
  expect(serious, serious.map((violation) => violation.id).join(", ")).toEqual([]);
}
