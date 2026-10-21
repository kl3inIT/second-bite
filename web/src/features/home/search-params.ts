import { createLoader, createParser, createSerializer, parseAsStringLiteral } from "nuqs/server";

import { offerKinds } from "@/features/offers/offer";

// "latitude,longitude" in decimal degrees, as `GET /offers` takes `near`.
const point = /^-?\d{1,2}(\.\d{1,6})?,-?\d{1,3}(\.\d{1,6})?$/;

/** Words searched, trimmed; none when only spaces. */
const parseAsWords = createParser({
  parse: (value) => value.trim() || null,
  serialize: (value: string) => value,
});

/** A switch that is on as `1` and absent otherwise. */
export const parseAsSwitch = createParser({
  parse: (value): boolean | null => (value === "1" ? true : null),
  serialize: (on: boolean) => (on ? "1" : ""),
});

/** The person's own place, as `latitude,longitude`. */
const parseAsPoint = createParser({
  parse: (value) => (point.test(value) ? value : null),
  serialize: (value: string) => value,
});

/**
 * What the home's address asks for (docs/guidelines/web.md › Lists and filters): `?q=` words, `?kind=` one kind,
 * `?now=1` collectable now, and `?near=21.057,105.896` the person's own place instead of Tasco Mall (Figma K1a).
 * The search reads the same keys and more.
 */
export const homeSearchParams = {
  q: parseAsWords,
  kind: parseAsStringLiteral(offerKinds),
  now: parseAsSwitch,
  near: parseAsPoint,
};

export const loadHomeSearchParams = createLoader(homeSearchParams);
export const serializeHomeSearchParams = createSerializer(homeSearchParams);

/** A query whose absent values are `undefined`, as the screens hold it, with `null` for nuqs, which leaves it out. */
export function nullable<T extends object>(
  query: T,
): { [K in keyof T]-?: NonNullable<T[K]> | null } {
  return Object.fromEntries(
    Object.entries(query).map(([key, value]) => [
      key,
      value === undefined || value === false ? null : value,
    ]),
  ) as { [K in keyof T]-?: NonNullable<T[K]> | null };
}

/** The reverse: what nuqs read, its `null`s as `undefined`. */
export function defined<T extends object>(read: T): { [K in keyof T]?: NonNullable<T[K]> } {
  return Object.fromEntries(
    Object.entries(read).map(([key, value]) => [key, value ?? undefined]),
  ) as { [K in keyof T]?: NonNullable<T[K]> };
}
