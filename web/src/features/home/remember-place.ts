"use server";

import { forgetPlace, keepPlace } from "./remembered-place";

/** Keeps the place chosen in the area sheet for the next visit, or forgets it for every shop (customer place, step 3). */
export async function rememberPlace(near: string | undefined, place?: string): Promise<void> {
  if (near) await keepPlace(near, place);
  else await forgetPlace();
}
