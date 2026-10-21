"use client";

import { Suspense } from "react";

import { usePathname } from "@/i18n/navigation";

import { isPushedScreen } from "./store-tabs";

function Frame({ screen, children }: { screen: "tab" | "push"; children: React.ReactNode }) {
  return (
    <div data-screen={screen} className="group/store contents">
      {children}
    </div>
  );
}

function PathFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <Frame screen={isPushedScreen(pathname) ? "push" : "tab"}>{children}</Frame>;
}

// Tells the store's pages which kind of screen is open (`data-screen`), so their phone layout can differ with
// CSS alone: a tab sits under the blue header with the bottom bar, a pushed screen (a dish form) has neither.
// It draws no box of its own. The address is runtime data, so until it is known a page is taken for a tab.
export function StoreFrame({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<Frame screen="tab">{children}</Frame>}>
      <PathFrame>{children}</PathFrame>
    </Suspense>
  );
}
