import { layers, namedFlavor } from "@protomaps/basemaps";
import type {
  ExpressionSpecification,
  FilterSpecification,
  LayerSpecification,
  StyleSpecification,
} from "maplibre-gl";

/**
 * Hanoi's box, the server's served area (`server/internal/seller/location.go`): west, south, east, north, as
 * MapLibre takes `maxBounds`. The map cannot leave it, so it never shows the sea, Hoàng Sa or Trường Sa.
 */
export const HANOI_BOUNDS: [number, number, number, number] = [105.25, 20.53, 106.06, 21.42];

/** Tasco Mall Long Biên, where the pilot's stores are: where a map opens when nothing better is known. */
export const TASCO_MALL = { latitude: 21.0565, longitude: 105.8964 };

/** The zoom a pin is placed at: street level, where a building can be told from the next one. */
export const STREET_ZOOM = 16;

/** How far out the map goes: the whole of Hanoi's box on a phone, never the country. */
export const MIN_ZOOM = 9;

/** The archive's deepest level is 15; MapLibre draws beyond it from that level's tiles. */
export const MAX_ZOOM = 19;

/**
 * The map's style on the site's own origin (the `map` service, `infrastructure/map/fetch.sh`): Protomaps' light
 * flavor with Vietnamese names, without the boundaries OpenStreetMap marks as disputed.
 */
export function hanoiStyle(origin: string): StyleSpecification {
  return {
    version: 8,
    glyphs: `${origin}/map/fonts/{fontstack}/{range}.pbf`,
    sprite: `${origin}/map/sprites/v4/light`,
    sources: {
      protomaps: {
        type: "vector",
        url: `pmtiles://${origin}/map/hanoi.pmtiles`,
        attribution:
          '<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
      },
    },
    layers: layers("protomaps", namedFlavor("light"), { lang: "vi" }).map(withoutDisputed),
  };
}

// The boundary layers filter in the legacy form (`["<=", "kind_detail", 2]`), which cannot sit beside an
// expression, so it is rewritten as one before `disputed` is ruled out.
function withoutDisputed(layer: LayerSpecification): LayerSpecification {
  if (!("source-layer" in layer) || layer["source-layer"] !== "boundaries") return layer;
  const notDisputed: ExpressionSpecification = ["!=", ["get", "disputed"], true];
  const filter = layer.filter ? asExpression(layer.filter) : undefined;
  return { ...layer, filter: filter ? ["all", filter, notDisputed] : notDisputed };
}

// A comparison of a property to a value, `[operator, key, value]`, becomes `[operator, ["get", key], value]`; a
// filter already written as an expression is kept.
function asExpression(filter: FilterSpecification): ExpressionSpecification {
  const [operator, key, value] = filter as unknown[];
  if (typeof key === "string" && ["==", "!=", "<", "<=", ">", ">="].includes(operator as string)) {
    return [operator, ["get", key], value] as ExpressionSpecification;
  }
  return filter as ExpressionSpecification;
}
