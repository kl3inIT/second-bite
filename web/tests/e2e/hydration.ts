import { expect, type Locator } from "@playwright/test";

/**
 * Waits until React has hydrated an element, so that a press reaches its handler. Until then the
 * server's HTML is on the screen and takes the press without doing anything: a button stays as it
 * was, and a link's client navigation is lost while the router starts. React keeps an element's
 * props on the node once it has hydrated it, under a key that starts with `__reactProps$`.
 * Copied from BeyondPilot's web/tests/e2e/hydration.ts.
 */
export async function hydrated(element: Locator) {
  await expect
    .poll(() =>
      element.evaluate((node) => Object.keys(node).some((key) => key.startsWith("__reactProps$"))),
    )
    .toBe(true);
  return element;
}
