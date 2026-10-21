import { StoreHeader } from "@/features/seller/store-header";

// The store's pages (SEC-57, Figma Q1 to Q4): under the header with the four tabs and the store's name. The
// header is a static shell and the address's parameter, which is runtime data, streams in inside it.
export default function StoreLayout({
  children,
  params,
}: LayoutProps<"/[locale]/stores/[sellerId]">) {
  const sellerId = params.then((p) => p.sellerId);

  return (
    <>
      <StoreHeader sellerId={sellerId} />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 pt-2 pb-14 md:pt-6 xl:max-w-300">
        {children}
      </main>
    </>
  );
}
