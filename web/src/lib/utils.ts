import { createCn } from "cn/config";

/**
 * DESIGN.md's type styles, the `text-body-13` utilities. Without them class merging reads such a class as a
 * text colour and drops the colour beside it; utils.test.ts keeps the list equal to tokens.css.
 */
export const typeStyles = [
  "display-40",
  "h1-28",
  "h2-22",
  "h3-20",
  "deal-34",
  "price-18",
  "price-16",
  "place-16",
  "button-16",
  "title-15",
  "body-14",
  "body-13",
  "caption-12",
  "micro-11",
  "overline-11",
] as const;

export const cn = createCn({
  extend: { classGroups: { "font-size": [{ text: [...typeStyles] }] } },
});
