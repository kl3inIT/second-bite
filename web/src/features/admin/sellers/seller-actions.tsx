"use client";

import { BanIcon, CheckIcon, CircleXIcon, type LucideIcon, RotateCcwIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState, useTransition } from "react";

import { toast } from "@/components/ui/toast";
import { isFeatureOn } from "@/features/admin/features";

import { useRouter } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { approveSeller, blockSeller, rejectSeller, type SellerBody } from "@/lib/api/generated";

import { ReasonDialog, type ReasonKind } from "./reason-dialog";
import { OWNERLESS_CODE } from "./review-actions";

type Target = Pick<SellerBody, "id" | "name" | "status">;
type Kind = "block" | "unblock" | "approve" | "reject";

/** What changes a store's status from where it stands (docs: admin-web-flow › Thao tác với cửa hàng). */
export type StatusAction = {
  kind: Kind;
  label: string;
  /** In a menu, "Chặn cửa hàng…": its dots say a question follows. */
  menuLabel: string;
  icon: LucideIcon;
  destructive: boolean;
  /** Why it cannot be pressed, said under the pointer: "Cửa hàng không còn chủ" (SEC-65). */
  refusal?: string;
};

/**
 * Blocking, unblocking and approving a store, from the list's row menu and from the store's page. Blocking asks
 * first for the reason its owner is emailed (AD-DS4); unblocking and approving run at once, both on
 * `POST …/approve`. Each says how it went in
 * a one-line toast and refreshes the page from the backend, which decides when two admins act together. While a
 * request is out, `pending` names the store and its buttons are locked, so two presses send one request.
 *
 * With the `storeReview` flag (SEC-64, SEC-65) a pending store can also be rejected with a reason (AD-DS3), a
 * rejected one approved, and a store with no owner left cannot be brought back.
 */
export function useSellerActions({
  review = isFeatureOn("storeReview"),
}: { review?: boolean } = {}) {
  const t = useTranslations("admin.sellers.actions");
  const router = useRouter();
  const [pending, setPending] = useState<string>();
  const [asking, setAsking] = useState<{ seller: Target; kind: ReasonKind }>();
  const [reason, setReason] = useState("");
  const [refreshing, startRefresh] = useTransition();
  const busy = useRef(false);

  function action(kind: Kind, refusal?: string): StatusAction {
    switch (kind) {
      case "block":
        return {
          kind,
          label: t("block"),
          menuLabel: t("blockMenu"),
          icon: BanIcon,
          destructive: true,
        };
      case "reject":
        return {
          kind,
          label: t("reject"),
          menuLabel: t("rejectMenu"),
          icon: CircleXIcon,
          destructive: true,
        };
      default: {
        const label = t(kind);
        const icon = kind === "unblock" ? RotateCcwIcon : CheckIcon;
        return { kind, label, menuLabel: label, icon, destructive: false, refusal };
      }
    }
  }

  /**
   * The store's actions in its menu's order: the one that admits it first, then "Từ chối…" (AD-DS1). `ownerless`
   * is known on the store's page from its members; SEC-65's backend refuses the rest.
   */
  function actionsFor(seller: Target, { ownerless = false } = {}): StatusAction[] {
    const refusal = review && ownerless ? t("ownerless") : undefined;
    switch (seller.status) {
      case "active":
        return [action("block")];
      case "blocked":
        return [action("unblock", refusal)];
      case "rejected":
        return [action("approve", refusal)];
      case "pending":
        return review ? [action("approve", refusal), action("reject")] : [action("approve")];
    }
  }

  async function send(seller: Target, kind: Kind) {
    const path = { sellerId: seller.id };
    const body = { reason: reason.trim() };
    if (kind === "reject") return rejectSeller({ path, body });
    if (kind === "block") return blockSeller({ path, body });
    return approveSeller({ path });
  }

  async function run(seller: Target, kind: Kind) {
    if (busy.current) return;
    busy.current = true;
    setPending(seller.id);
    try {
      await send(seller, kind);
      startRefresh(() => router.refresh());
      const emailed = kind === "block" || kind === "reject";
      toast.add({
        title: emailed
          ? t(`emailed.${kind}`, { name: seller.name })
          : t(`done.${kind}`, { name: seller.name }),
        type: "success",
        timeout: 5000,
      });
    } catch (error) {
      const ownerless = review && error instanceof ApiError && error.code === OWNERLESS_CODE;
      toast.add({
        title: ownerless
          ? t("ownerlessFailed", { name: seller.name })
          : t("failed", { name: seller.name }),
        type: "error",
        timeout: 5000,
      });
    } finally {
      busy.current = false;
      setPending(undefined);
      setAsking(undefined);
    }
  }

  /** Does one of the store's actions: asks before a block or a reject, runs the others at once. */
  function act(seller: Target, kind: Kind) {
    if (kind === "block" || kind === "reject") {
      setReason("");
      setAsking({ seller, kind });
    } else {
      void run(seller, kind);
    }
  }

  const close = (open: boolean) => !open && setAsking(undefined);
  const dialog = (
    <ReasonDialog
      kind={asking?.kind ?? "block"}
      name={asking?.seller.name ?? ""}
      open={asking !== undefined}
      onOpenChange={close}
      reason={reason}
      onReason={setReason}
      pending={pending !== undefined}
      onConfirm={() => asking && void run(asking.seller, asking.kind)}
    />
  );
  return { actionsFor, act, pending, locked: pending !== undefined || refreshing, dialog };
}
