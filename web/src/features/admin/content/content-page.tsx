import { notFound } from "next/navigation";

import type { SearchParams } from "../promotions/list-query";
import { bannerFormOf, placementOf } from "./banner";
import { BannerEditor } from "./banner-editor";
import { getBanner, getContent, listBannerStores } from "./content-source";
import { ContentView } from "./content-view";

/** The banners page's read: the placement from the address, then the banners and the collections. */
export async function ContentPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const placement = placementOf(await searchParams);
  const content = await getContent();
  return <ContentView content={content} placement={placement} />;
}

/**
 * The banner editor's read: "new" starts a blank banner; any other id is a banner to change, and one that is not
 * kept answers the admin's not-found page.
 */
export async function BannerPage({ bannerId }: { bannerId: Promise<string> }) {
  const id = await bannerId;
  const [banner, content, stores] = await Promise.all([
    id === "new" ? null : getBanner(id),
    getContent(),
    listBannerStores(),
  ]);
  if (id !== "new" && !banner) notFound();

  return (
    <BannerEditor
      editing={banner ?? undefined}
      initial={banner ? bannerFormOf(banner) : undefined}
      banners={content.banners}
      collections={content.collections}
      stores={stores}
    />
  );
}
