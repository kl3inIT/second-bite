import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { AppHeader } from "@/components/app-header";
import { BrandLoader } from "@/components/brand-loader";

import { readHomeQuery } from "@/features/home/home-query";
import { DishDetails } from "@/features/offers/dish-details";
import { SearchField } from "@/features/home/search-field";
import { AccountAction } from "@/features/identity/account-action";
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
// request time, so the page streams in. A phone has the back button on the photograph instead of the header;
// from 1024px the site's header leads, as Figma WK4.
export default function DishPage(props: PageProps<"/[locale]/offers/[id]">) {
  return (
    <>
      <div className="hidden lg:contents">
        <AppHeader
          search={<SearchField />}
          account={
            <Suspense>
              <DishAccount params={props.params} />
            </Suspense>
          }
        />
      </div>
      <Suspense fallback={<BrandLoader />}>
        <Dish {...props} />
      </Suspense>
    </>
  );
}

async function DishAccount({ params }: { params: PageProps<"/[locale]/offers/[id]">["params"] }) {
  return <AccountAction returnTo={`/offers/${(await params).id}`} />;
}

async function Dish({ params, searchParams }: PageProps<"/[locale]/offers/[id]">) {
  const [{ id }, { near }] = await Promise.all([params, searchParams.then(readHomeQuery)]);
  const found = await getDish(id, near);
  if (!found) notFound();

  return <DishDetails dish={found.dish} others={found.others} near={near} />;
}
