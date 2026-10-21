import { createCn } from "cn/config";

/**
 * DESIGN.md's type styles, the `text-body-sm` utilities. Without them class merging reads such a class as a
 * text colour and drops the colour beside it; utils.test.ts keeps the list equal to tokens.css.
 */
export const typeStyles = [
  "label",
  "label-strong",
  "body-sm",
  "body-sm-strong",
  "body",
  "title",
  "title-lg",
  "card-title",
  "note",
  "button",
  "bar-title",
  "headline",
  "hero",
  "page-title",
  "figure-sm",
  "price-sm",
  "price",
  "price-lg",
  "display",
  "display-60",
  "card-heading",
] as const;

export const cn = createCn({
  extend: { classGroups: { "font-size": [{ text: [...typeStyles] }] } },
});
