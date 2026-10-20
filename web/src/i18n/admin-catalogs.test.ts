import { readdir } from "node:fs/promises";

import { describe, expect, it } from "vitest";

import { adminCatalogs } from "./admin-catalogs";
import { routing } from "./routing";

describe("the admin catalogs", () => {
  it("are exactly the files in messages/admin, one per language", async () => {
    const files = await readdir(new URL("../../messages/admin/", import.meta.url));
    const expected = adminCatalogs.flatMap((name) =>
      routing.locales.map((locale) => `${name}.${locale}.json`),
    );
    expect(files.toSorted()).toEqual(expected.toSorted());
  });
});
