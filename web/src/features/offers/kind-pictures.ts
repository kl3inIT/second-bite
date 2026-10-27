import type { StaticImageData } from "next/image";

import bakery from "./kinds/bakery.jpg";
import cakes from "./kinds/cakes.jpg";
import drinks from "./kinds/drinks.jpg";
import ingredients from "./kinds/ingredients.jpg";
import mixedBox from "./kinds/mixed-box.jpg";
import noodles from "./kinds/noodles.jpg";
import other from "./kinds/other.jpg";
import preparedFood from "./kinds/prepared-food.jpg";
import vegetables from "./kinds/vegetables.jpg";

import type { OfferKind } from "./offer";

/** One picture per kind, each a dish of a Tasco Mall shop (Figma kind/Bánh…). */
export const kindPictures: Record<OfferKind, StaticImageData> = {
  bakery,
  prepared_food: preparedFood,
  ingredients,
  drinks,
  mixed_box: mixedBox,
  dessert: cakes,
  snacks: noodles,
  produce: vegetables,
  other,
};
