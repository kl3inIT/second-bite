import { validateStyleMin } from "@maplibre/maplibre-gl-style-spec";
import { describe, expect, it } from "vitest";

import { hanoiStyle } from "./map-style";

describe("hanoiStyle", () => {
  const style = hanoiStyle("https://secondbite.example");

  it("is a style MapLibre accepts, the rewritten boundary filters included", () => {
    expect(validateStyleMin(style)).toEqual([]);
  });

  it("reads the archive, glyphs and sprites from the site's own origin", () => {
    expect(style.glyphs).toBe("https://secondbite.example/map/fonts/{fontstack}/{range}.pbf");
    expect(style.sprite).toBe("https://secondbite.example/map/sprites/v4/light");
    expect(style.sources.protomaps).toMatchObject({
      url: "pmtiles://https://secondbite.example/map/hanoi.pmtiles",
    });
  });

  it("leaves out every boundary OpenStreetMap marks as disputed", () => {
    const boundaries = style.layers.filter(
      (layer) => "source-layer" in layer && layer["source-layer"] === "boundaries",
    );
    expect(boundaries.length).toBeGreaterThan(0);
    for (const layer of boundaries) {
      expect(JSON.stringify("filter" in layer && layer.filter)).toContain(
        '["!=",["get","disputed"],true]',
      );
    }
  });
});
