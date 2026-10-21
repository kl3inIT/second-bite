import { expect, type Page } from "@playwright/test";

/** Tasco Mall, where the tests stand when they open a store. */
export const TASCO_MALL = { latitude: 21.0565, longitude: 105.8964, accuracy: 15 };

/**
 * Pins the store being opened where the browser says the person stands, through the button at the end of the
 * address, and waits until the form has the pin: the location is required since SEC-66. The context grants the
 * location (`test.use({ permissions: ["geolocation"], geolocation: TASCO_MALL })`).
 */
export async function pinHere(page: Page) {
  await page.getByRole("button", { name: "Dùng vị trí hiện tại" }).click();
  await expect(page.getByRole("button", { name: "Chỉnh vị trí" })).toBeVisible();
}
