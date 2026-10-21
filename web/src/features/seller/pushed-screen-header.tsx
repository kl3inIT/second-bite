import { getTranslations } from "next-intl/server";

import { AppHeader } from "@/components/app-header";
import { TopBar } from "@/components/top-bar";

// The header of a screen the person is sent to from the account (my stores, open a store; Figma "Mobile 390"
// S0, O1): on a phone the top bar with the screen's name and a way back, from `md` the blue header as before.
export async function PushedScreenHeader({
  namespace,
  back,
}: {
  namespace: "Stores" | "OpenStore";
  back: string;
}) {
  const t = await getTranslations(namespace);

  return (
    <>
      <div className="md:hidden">
        <TopBar title={t("title")} back={back} />
      </div>
      <div className="max-md:hidden">
        <AppHeader />
      </div>
    </>
  );
}
