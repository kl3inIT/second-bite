import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { Suspense } from "react";

import { BrandLoader } from "@/components/brand-loader";

import { dishSeller } from "@/features/offers/dish-seller";
import { dishHref } from "@/features/offers/offer";
import { redirect } from "@/i18n/navigation";

// A dish has no page of its own (Figma K4): an address shared or kept from before leads to its seller's page,
// scrolled to its row. The address is known only at request time, so the redirect streams in.
export default function DishPage(props: PageProps<"/[locale]/offers/[id]">) {
  return (
    <Suspense fallback={<BrandLoader />}>
      <Dish {...props} />
    </Suspense>
  );
}

async function Dish({ params }: PageProps<"/[locale]/offers/[id]">) {
  const { id } = await params;
  const sellerId = await dishSeller(id);
  if (!sellerId) notFound();

  return redirect({ href: dishHref({ id, sellerId }), locale: await getLocale() });
}
