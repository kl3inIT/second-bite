import type { DishBody, OfferBody } from "@/lib/api/generated";

// What posting a dish asks of the person (SEC-57, Figma P3, P3e): the price against the original price, and the
// hour the dish is ready and how long customers have to collect it. The backend decides in the end
// (server/internal/offer, the settings); these rules only tell the person at once what it will refuse.

/** The first value of the offer settings (docs/specs/offer.md); an admin may change it, and the backend then answers. */
export const MIN_DISCOUNT_PERCENT = 20;
export const MIN_WINDOW_MINUTES = 30;
export const MAX_WINDOW_MINUTES = 360;

/** The dearest price that is still the minimum discount below the original price. */
export function maxPrice(original: number, minDiscountPercent = MIN_DISCOUNT_PERCENT): number {
  return Math.floor((original * (100 - minDiscountPercent)) / 100);
}

/**
 * The price a post starts from once the original price is known: the dearest one that keeps the minimum
 * discount, in whole hundreds of đồng (76.000đ for 95.000đ, 7.900đ for 9.990đ, which is 20% off, not 29%); nothing
 * while no price of at least 1.000đ keeps the discount.
 */
export function suggestedPrice(original: number): number | undefined {
  if (!Number.isFinite(original)) return undefined;
  const price = Math.floor(maxPrice(original) / 100) * 100;
  return price >= 1000 ? price : undefined;
}

/** The discount of a price, in whole percent, rounded down. */
export function discountPercent(original: number, price: number): number {
  return original > 0 ? Math.floor(((original - price) * 100) / original) : 0;
}

export type PriceProblem = "missing" | "tooHigh";

/** Why a price cannot be posted against the original price, or nothing. */
export function priceProblem(original: number, price: number): PriceProblem | undefined {
  if (!Number.isFinite(price) || price < 1000 || !Number.isFinite(original) || original < 1000) {
    return "missing";
  }
  return price > maxPrice(original) ? "tooHigh" : undefined;
}

/** When the dish is ready: the moment the post is made, or a time of today. */
export type Start = { kind: "now" } | { kind: "at"; hour: number; minute: number };

/** A day as `2026-10-20` in Vietnam's time. */
const dayInVietnam = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" });

function two(n: number): string {
  return String(n).padStart(2, "0");
}

/** "20:30". */
export function clock(hour: number, minute: number): string {
  return `${two(hour)}:${two(minute)}`;
}

/** The window of a post made at `now`: from `start`, for `minutes`. Times of the day are Vietnam's. */
export function windowOf(start: Start, minutes: number, now: Date): { start: Date; end: Date } {
  const begin =
    start.kind === "now"
      ? new Date(Math.floor(now.getTime() / 60_000) * 60_000)
      : new Date(`${dayInVietnam.format(now)}T${clock(start.hour, start.minute)}:00+07:00`);
  return { start: begin, end: new Date(begin.getTime() + minutes * 60_000) };
}

/** Whether the last handover is already past: nothing can be collected, so the post would be refused. */
export function windowIsOver(window: { end: Date }, now: Date): boolean {
  return window.end.getTime() <= now.getTime();
}

/** Whether the length of the window is one the offer settings allow. */
export function lengthIsAllowed(minutes: number): boolean {
  return minutes >= MIN_WINDOW_MINUTES && minutes <= MAX_WINDOW_MINUTES;
}

/** A dish a store has posted before, with what it was posted with: the next post starts from it. */
export type Dish = {
  /** Which post or catalog dish it comes from, to tell dishes of the same name apart. */
  id: string;
  name: string;
  kind: OfferBody["kind"];
  description: string;
  unit: string;
  /** What the last post of it had; a catalog dish has none, so the post form starts empty. */
  units?: number;
  originalPriceVnd?: number;
  priceVnd?: number;
  photoId: string;
  photoPath: string;
  /** The hour of day it was last put on sale, "the usual time" of Figma P3. */
  usual?: { hour: number; minute: number };
};

const hourInVietnam = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Ho_Chi_Minh",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export function dishOf(offer: OfferBody): Dish {
  const parts = hourInVietnam.formatToParts(new Date(offer.windowStart));
  const part = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return {
    id: offer.id,
    name: offer.name,
    kind: offer.kind,
    description: offer.description,
    unit: offer.unit,
    units: offer.units,
    originalPriceVnd: offer.originalPriceVnd,
    priceVnd: offer.priceVnd,
    photoId: offer.photo.id,
    photoPath: offer.photo.smallPath,
    usual: { hour: part("hour"), minute: part("minute") },
  };
}

/** The dishes of a store's posts, each once, the most recently posted first (the list is newest first). */
export function dishesOf(offers: readonly OfferBody[]): Dish[] {
  const seen = new Set<string>();
  const dishes: Dish[] = [];
  for (const offer of offers) {
    if (seen.has(offer.name)) continue;
    seen.add(offer.name);
    dishes.push(dishOf(offer));
  }
  return dishes;
}

/** Units already taken by customers: the post's units less what is left. */
export function orderedOf(offer: OfferBody): number {
  return offer.units - offer.unitsLeft;
}

/** A live post being changed (Figma E1, E2): what the drawer starts from, and how far it may go. */
export type EditTarget = {
  offerId: string;
  status: "on_sale" | "sold_out";
  /** Units ordered; the price and the hours are fixed once there are any, and the units cannot go below them. */
  ordered: number;
  /** The length of its collection window, in minutes. */
  minutes: number;
  dish: Dish;
};

/** The post as something to change; nothing for one that is over or withdrawn, which no longer changes. */
export function editTargetOf(offer: OfferBody): EditTarget | undefined {
  if (offer.status !== "on_sale" && offer.status !== "sold_out") return undefined;
  return {
    offerId: offer.id,
    status: offer.status,
    ordered: orderedOf(offer),
    minutes: Math.round((Date.parse(offer.windowEnd) - Date.parse(offer.windowStart)) / 60_000),
    dish: dishOf(offer),
  };
}

/** What a post says of a dish from the catalog: its description, then its ingredients and allergens (at most 1,000 characters). */
function describeDish(dish: DishBody): string {
  return [dish.description, dish.ingredients].filter(Boolean).join(". ").slice(0, 1000);
}

/** A dish of the catalog as the post form starts from it: its base, with no units, price or hours. */
export function catalogDishOf(dish: DishBody): Dish {
  return {
    id: dish.id,
    name: dish.name,
    kind: dish.kind,
    description: describeDish(dish),
    unit: dish.unit,
    originalPriceVnd: dish.originalPriceVnd,
    photoId: dish.photo.id,
    photoPath: dish.photo.smallPath,
  };
}
