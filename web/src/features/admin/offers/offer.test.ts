import { describe, expect, test } from "vitest";

import {
  canRemove,
  cardLook,
  fromDay,
  offersHref,
  readOfferQuery,
  statusLook,
  toDay,
  toggleSort,
} from "./offer";

describe("the posts' address", () => {
  test("reads every post, the latest window first, by default", () => {
    expect(readOfferQuery({})).toEqual({
      status: undefined,
      page: 1,
      q: "",
      seller: undefined,
      kind: undefined,
      from: undefined,
      to: undefined,
      sort: "window",
      direction: "desc",
      offer: undefined,
    });
  });

  test("keeps what it knows and drops what it does not", () => {
    expect(
      readOfferQuery({
        status: "removed",
        kind: "bakery",
        from: "2026-10-14",
        to: "2026-10-20",
        sort: "price",
        dir: "asc",
        offer: "o-1",
      }),
    ).toMatchObject({
      status: "removed",
      kind: "bakery",
      from: "2026-10-14",
      to: "2026-10-20",
      sort: "price",
      direction: "asc",
      offer: "o-1",
    });
    expect(
      readOfferQuery({ status: "gone", kind: "pizza", from: "14/10", sort: "stars" }),
    ).toMatchObject({ status: undefined, kind: undefined, from: undefined, sort: "window" });
  });

  test("writes only what differs from the default, and reads back the same", () => {
    expect(offersHref(readOfferQuery({}))).toBe("/admin/offers");
    const query = readOfferQuery({ status: "withdrawn", q: "bánh", page: "2", offer: "o-9" });
    const href = offersHref(query);
    expect(href).toBe("/admin/offers?status=withdrawn&q=b%C3%A1nh&page=2&offer=o-9");
    expect(readOfferQuery(Object.fromEntries(new URL(href, "http://x").searchParams))).toEqual(
      query,
    );
  });

  test("a heading sorts its column down first, then up, and closes the panel", () => {
    const query = readOfferQuery({ offer: "o-1", page: "3" });
    const byPrice = toggleSort(query, "price");
    expect(byPrice).toMatchObject({ sort: "price", direction: "desc", page: 1, offer: undefined });
    expect(toggleSort(byPrice, "price").direction).toBe("asc");
    expect(toggleSort(query, "window").direction).toBe("asc");
  });

  test("a day of the filter goes to the address and back", () => {
    expect(toDay(new Date(2026, 9, 4))).toBe("2026-10-04");
    expect(fromDay("2026-10-04")).toEqual(new Date(2026, 9, 4));
    expect(fromDay(undefined)).toBeUndefined();
  });
});

describe("a post's status", () => {
  test("looks as Figma AD-BD1 draws it", () => {
    expect(statusLook("on_sale").tone).toBe("success");
    expect(statusLook("sold_out").tone).toBe("warning");
    expect(statusLook("withdrawn").tone).toBe("neutral");
    expect(statusLook("removed").tone).toBe("error");
    expect(cardLook("closed").tone).toBe("warning");
    expect(cardLook("removed").tone).toBe("error");
  });

  test("an admin removes only a post that is still up", () => {
    expect(canRemove("on_sale")).toBe(true);
    expect(canRemove("sold_out")).toBe(true);
    expect(canRemove("closed")).toBe(true);
    expect(canRemove("withdrawn")).toBe(false);
    expect(canRemove("removed")).toBe(false);
  });
});
