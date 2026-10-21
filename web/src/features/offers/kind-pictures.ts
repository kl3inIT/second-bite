import type { StaticImageData } from "next/image";

import bakery from "./kinds/bakery.jpg";
import drinks from "./kinds/drinks.jpg";
import ingredients from "./kinds/ingredients.jpg";
import mixedBox from "./kinds/mixed-box.jpg";
import other from "./kinds/other.jpg";
import preparedFood from "./kinds/prepared-food.jpg";

import type { OfferKind } from "./offer";

/** One picture per kind, each a dish of a Tasco Mall shop (Figma kind/Bánh…). */
export const kindPictures: Record<OfferKind, StaticImageData> = {
  bakery,
  prepared_food: preparedFood,
  ingredients,
  drinks,
  mixed_box: mixedBox,
  other,
};
