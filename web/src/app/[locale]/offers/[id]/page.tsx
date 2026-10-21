import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { BrandLoader } from "@/components/brand-loader";

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

// A dish (Figma K4), opened from any card; `near` keeps the distance the cards showed. The address is known only at
// request time, so the page streams in.
export default function DishPage(props: PageProps<"/[locale]/offers/[id]">) {
  return (
    <Suspense fallback={<BrandLoader />}>
      <Dish {...props} />
    </Suspense>
  );
}

async function Dish({ params, searchParams }: PageProps<"/[locale]/offers/[id]">) {
  const [{ id }, { near }] = await Promise.all([params, searchParams.then(readHomeQuery)]);
  const found = await getDish(id, near);
  if (!found) notFound();

  return <DishDetails dish={found.dish} others={found.others} near={near} />;
}
