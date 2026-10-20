import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { FilterSelect } from "./filter-bar";

describe("a filter select", () => {
  it("names its combobox by its label, which a combobox does not take from its content", () => {
    const html = renderToString(
      createElement(FilterSelect, {
        label: "Khu vực",
        value: "all",
        options: [{ value: "all", label: "Tất cả" }],
        onChange: () => undefined,
      }),
    );
    const labelledBy =
      /role="combobox"[^>]*aria-labelledby="([^"]+)"|aria-labelledby="([^"]+)"[^>]*role="combobox"/.exec(
        html,
      );
    const id = labelledBy?.[1] ?? labelledBy?.[2];
    expect(id).toBeTruthy();
    expect(html).toContain(`id="${id}"`);
    expect(html).toMatch(new RegExp(`id="${id}"[^>]*>Khu vực<!-- -->:`));
  });
});
