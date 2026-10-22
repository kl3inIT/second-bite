import {
  createLoader,
  createSerializer,
  parseAsInteger,
  parseAsIsoDate,
  parseAsNumberLiteral,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

/** The cards over the list that filter it (Figma AD-DG1): the poor reviews and the hidden ones. */
export const reviewCards = ["low", "hidden"] as const;

export type ReviewCard = (typeof reviewCards)[number];

/** The stars the "Số sao" choice offers. */
export const reviewStars = [1, 2, 3, 4, 5] as const;

/** The rows a page may hold, as the "Số dòng" choice offers them. */
export const reviewPageSizes = [10, 25, 50] as const;

/**
 * What every review is filtered by, kept in the address (SEC-75 › Lists, `nuqs`): a card, words, a number of
 * stars, a store, a range of days rated, the page and its size. Absent, the list shows every review, the
 * latest first, 10 a page as Figma AD-DG1 draws it.
 */
export const reviewSearchParams = {
  card: parseAsStringLiteral(reviewCards),
  q: parseAsString.withDefault(""),
  stars: parseAsNumberLiteral(reviewStars),
  store: parseAsString,
  from: parseAsIsoDate,
  to: parseAsIsoDate,
  page: parseAsInteger.withDefault(1),
  size: parseAsNumberLiteral(reviewPageSizes).withDefault(10),
};

export const loadReviewSearchParams = createLoader(reviewSearchParams);
export const serializeReviewSearchParams = createSerializer(reviewSearchParams);

/** The stars the API is asked for: the card "1–2 sao" asks for one and two, else the choice made. */
export function starsAsked(card: ReviewCard | null, stars: number | null): number[] | undefined {
  if (card === "low") return [1, 2];
  return stars === null ? undefined : [stars];
}
