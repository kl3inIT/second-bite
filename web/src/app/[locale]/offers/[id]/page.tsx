import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { readHomeQuery } from "@/features/home/home-query";
import { DishDetails } from "@/features/offers/dish-details";
import { getDish } from "@/features/offers/get-dish";

export async function generateMetadata({
  params,
  searchParams,
}: PageProps<"/[locale]/offers/[id]">): Promise<Metadata> {
  const [{ id }, { near }] = await Promise.all([params, searchParams.then(readHomeQuery)]);
  const found = await getDish(id, near);
  return { title: found ? `${found.dish.name} · Second Bite` : "Second Bite" };
}

// A dish (Figma K4), opened from any card; `near` keeps the distance the cards showed.
export default async function DishPage({
  params,
  searchParams,
}: PageProps<"/[locale]/offers/[id]">) {
  const [{ id }, { near }] = await Promise.all([params, searchParams.then(readHomeQuery)]);
  const found = await getDish(id, near);
  if (!found) notFound();

  return <DishDetails dish={found.dish} others={found.others} near={near} />;
}
