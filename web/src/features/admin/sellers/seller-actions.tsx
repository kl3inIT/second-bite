"use client";

import {
  BanIcon,
  CheckIcon,
  CircleXIcon,
  EyeIcon,
  type LucideIcon,
  RotateCcwIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState, useTransition } from "react";

import { showAdminToast } from "@/features/admin/admin-toast";
import { isFeatureOn } from "@/features/admin/features";
import { ConfirmDialog, ConsequenceList } from "@/features/admin/ui/confirm-dialog";
import { useRouter } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { activateSeller, blockSeller } from "@/lib/api/generated";

import { ReasonDialog, type ReasonKind } from "./reason-dialog";
import {
  blockSellerWithReason,
  OWNERLESS_CODE,
  reasonsReady,
  rejectSeller,
} from "./review-actions";
import type { AdminSeller } from "./seller-list";

type Target = Pick<AdminSeller, "id" | "name" | "status">;
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
 * first (AD-Q5, AD-Q7); unblocking and approving run at once, both on `POST …/activate`. Each says how it went in
 * a one-line toast and refreshes the page from the backend, which decides when two admins act together. While a
 * request is out, `pending` names the store and its buttons are locked, so two presses send one request.
 *
 * With the `storeReview` flag (SEC-64, SEC-65) a pending store can also be rejected, a rejected one approved,
 * rejecting and blocking ask for a reason (AD-DS3, AD-DS4), and a store with no owner left cannot be brought back.
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
    if (kind === "reject") return rejectSeller(seller.id, { reason: reason.trim() });
    if (kind === "block" && review)
      return blockSellerWithReason(seller.id, { reason: reason.trim() });
    if (kind === "block") return blockSeller({ path });
    return activateSeller({ path });
  }

  async function run(seller: Target, kind: Kind) {
    if (busy.current) return;
    busy.current = true;
    setPending(seller.id);
    try {
      await send(seller, kind);
      startRefresh(() => router.refresh());
      const emailed = review && (kind === "block" || kind === "reject");
      showAdminToast(
        emailed
          ? t(`emailed.${kind}`, { name: seller.name })
          : t(`done.${kind}`, { name: seller.name }),
      );
    } catch (error) {
      const ownerless = review && error instanceof ApiError && error.code === OWNERLESS_CODE;
      showAdminToast(
        ownerless
          ? t("ownerlessFailed", { name: seller.name })
          : t("failed", { name: seller.name }),
        "error",
      );
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
  // Without the flag, blocking keeps its first dialog, with no reason (AD-Q5).
  const dialog = review ? (
    <ReasonDialog
      kind={asking?.kind ?? "block"}
      name={asking?.seller.name ?? ""}
      open={asking !== undefined}
      onOpenChange={close}
      reason={reason}
      onReason={setReason}
      ready={reasonsReady}
      pending={pending !== undefined}
      onConfirm={() => asking && void run(asking.seller, asking.kind)}
    />
  ) : (
    <ConfirmDialog
      open={asking !== undefined}
      onOpenChange={close}
      title={t("confirm.title", { name: asking?.seller.name ?? "" })}
      confirmLabel={t("block")}
      confirmIcon={BanIcon}
      destructive
      pending={pending !== undefined}
      onConfirm={() => asking && void run(asking.seller, "block")}
    >
      <div className="flex flex-col gap-3">
        <ConsequenceList
          title={t("confirm.when")}
          items={[
            { icon: BanIcon, text: t("confirm.noPosting") },
            { icon: EyeIcon, text: t("confirm.hidden") },
            { icon: CheckIcon, text: t("confirm.kept") },
          ]}
        />
        <p className="flex items-center gap-2 text-body-sm text-muted-foreground">
          <RotateCcwIcon aria-hidden className="size-4 shrink-0" />
          {t("confirm.undo")}
        </p>
      </div>
    </ConfirmDialog>
  );

  return { actionsFor, act, pending, locked: pending !== undefined || refreshing, dialog };
}
