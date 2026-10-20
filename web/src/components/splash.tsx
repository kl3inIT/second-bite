import { getTranslations } from "next-intl/server";

import { Wordmark } from "./wordmark";

// Remembers the splash for the rest of the visit before it is painted, so only a visit's first page shows it.
const once = `try{var s=sessionStorage;s.getItem("secondbite.splash")?document.documentElement.dataset.splash="seen":s.setItem("secondbite.splash","1")}catch(e){}`;

// The splash of a phone's first page in a visit (Figma K0 · Màn chờ): the white wordmark and the tagline on
// Tasco blue, fading out to the page already drawn beneath it. It is decoration, hidden from assistive
// technology, gone at once for reduced motion and absent on a wide screen.
export async function Splash() {
  const t = await getTranslations("Splash");

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: once }} />
      <div
        aria-hidden
        className="fixed inset-0 z-60 splash flex flex-col items-center justify-center gap-4 bg-header text-header-foreground md:hidden"
      >
        <Wordmark className="h-12" />
        <p className="text-body-sm-strong text-header-foreground/80">{t("tagline")}</p>
      </div>
    </>
  );
}
