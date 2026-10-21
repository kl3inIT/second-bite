import { describe, expect, it } from "vitest";

import { orderIdOf } from "./order-code";

describe("orderIdOf", () => {
  it("reads an order's identifier as the QR holds it", () => {
    expect(orderIdOf("01A15DEB-DD75-7E6D-9A41-0F2C3B4D5E6F")).toBe(
      "01a15deb-dd75-7e6d-9a41-0f2c3b4d5e6f",
    );
    expect(orderIdOf(" 01a15deb-dd75-7e6d-9a41-0f2c3b4d5e6f\n")).toBe(
      "01a15deb-dd75-7e6d-9a41-0f2c3b4d5e6f",
    );
  });

  it("does not take anything else for an order", () => {
    expect(orderIdOf("https://secondbite.vadan.app/vi/orders/01a15deb")).toBeUndefined();
    expect(orderIdOf("01a15deb-dd75-7e6d-9a41")).toBeUndefined();
    expect(orderIdOf("")).toBeUndefined();
  });
});
