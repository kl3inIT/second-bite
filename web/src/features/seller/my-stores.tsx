import { UserRoundIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { SellerAvatar } from "@/features/offers/seller-avatar";
import { Link } from "@/i18n/navigation";

import { getMySellers, MAX_OWNED } from "./my-sellers";
import { StorePanel } from "./store-panel";

// The stores of the person signed in (Figma S0): a row per store, and "Tạo quán mới" while they own fewer than
// five; with none, the card that says so. It reads the session, so it renders inside Suspense.
export async function MyStores() {
  const [t, sellers] = await Promise.all([getTranslations("Stores"), getMySellers()]);
  const owned = sellers.filter((seller) => seller.myRole === "owner").length;

  return (
    <StorePanel labelledBy="my-stores" className="gap-4">
      {sellers.length === 0 ? (
        <div className="flex items-center gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <UserRoundIcon aria-hidden className="size-6" />
          </span>
          <div className="flex min-w-0 flex-col">
            <h1 id="my-stores" className="text-title">
              {t("noneTitle")}
            </h1>
            <p className="text-body-sm text-muted-foreground">{t("noneBody")}</p>
          </div>
        </div>
      ) : (
        <>
          <h1 id="my-stores" className="text-title">
            {t("title")}
          </h1>
          <ul className="flex flex-col">
            {sellers.map((seller) => (
              <li key={seller.id} className="border-t border-border first:border-t-0">
                <Link
                  href={`/stores/${seller.id}`}
                  className="flex min-h-14 items-center gap-3 rounded-lg py-2 focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <SellerAvatar seller={seller} size="md" />
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-title">{seller.name}</span>
                    <span className="truncate text-body-sm text-muted-foreground">
                      {seller.myRole === "staff" ? t("staff") : t("owner")} · {seller.address}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
      {owned < MAX_OWNED && (
        <Link href="/open-store" className={buttonVariants({ size: "lg" })}>
          {t("create")}
        </Link>
      )}
    </StorePanel>
  );
}
