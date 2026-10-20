"use client";

import { createContext, type ReactNode, use, useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Trail = {
  /** The last crumb of a detail page: the store's, the order's or the account's name. */
  last?: string;
  /** The address answers no admin page: the trail reads "Quản trị / Không tìm thấy". */
  notFound?: boolean;
};

type CrumbContext = {
  trail: Trail;
  setTrail: (trail: Trail) => void;
  actions: HTMLElement | null;
  setActions: (element: HTMLElement | null) => void;
};

const Crumbs = createContext<CrumbContext | null>(null);

/** Holds what a page tells the top bar: the name at the end of its breadcrumb and the actions on its right. */
export function AdminCrumbsProvider({ children }: { children: ReactNode }) {
  const [trail, setTrail] = useState<Trail>({});
  const [actions, setActions] = useState<HTMLElement | null>(null);
  return <Crumbs value={{ trail, setTrail, actions, setActions }}>{children}</Crumbs>;
}

export function useAdminCrumbs(): CrumbContext {
  const context = use(Crumbs);
  if (!context) throw new Error("useAdminCrumbs needs AdminCrumbsProvider (the admin layout)");
  return context;
}

/**
 * The name at the end of a detail page's breadcrumb, "Vận hành / Cửa hàng / Tiệm bánh Pháp" (Figma
 * Admin/TopBar levels=3). A detail page renders it once it knows the name; it draws nothing itself.
 */
export function AdminCrumb({ label }: { label: string }) {
  const { setTrail } = useAdminCrumbs();
  useEffect(() => {
    setTrail({ last: label });
    return () => setTrail({});
  }, [label, setTrail]);
  return null;
}

/** Marks the page as not found, for the breadcrumb (Figma AD-TT5). */
export function AdminNotFoundCrumb() {
  const { setTrail } = useAdminCrumbs();
  useEffect(() => {
    setTrail({ notFound: true });
    return () => setTrail({});
  }, [setTrail]);
  return null;
}

/**
 * Puts a page's own controls on the right of the top bar, such as the ‹ 1 / 5 › of a store's detail (Figma
 * Admin/TopBar `pager`).
 */
export function AdminTopBarActions({ children }: { children: ReactNode }) {
  const { actions } = useAdminCrumbs();
  return actions ? createPortal(children, actions) : null;
}
