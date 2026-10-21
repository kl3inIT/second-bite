"use client";

import { usePathname } from "@/i18n/navigation";

import { isPushedScreen } from "./store-tabs";

// Tells the store's pages which kind of screen is open (`data-screen`), so their phone layout can differ with
// CSS alone: a tab sits under the blue header with the bottom bar, a pushed screen (a dish form) has neither.
// It draws no box of its own.
export function StoreFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div data-screen={isPushedScreen(pathname) ? "push" : "tab"} className="group/store contents">
      {children}
    </div>
  );
}
