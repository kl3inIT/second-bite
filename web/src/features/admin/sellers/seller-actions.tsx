"use client";

import { BanIcon, CheckIcon, EyeIcon, type LucideIcon, RotateCcwIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState, useTransition } from "react";

import { showAdminToast } from "@/features/admin/admin-toast";
import { ConfirmDialog, ConsequenceList } from "@/features/admin/ui/confirm-dialog";
import { useRouter } from "@/i18n/navigation";
import { activateSeller, blockSeller, type SellerBody } from "@/lib/api/generated";

type Target = Pick<SellerBody, "id" | "name" | "status">;

/** What changes a store's status from where it stands (docs: admin-web-flow › Thao tác với cửa hàng). */
export type StatusAction = {
  kind: "block" | "unblock" | "approve";
  label: string;
  /** In a menu, "Chặn cửa hàng…": its dots say a question follows. */
  menuLabel: string;
  icon: LucideIcon;
  destructive: boolean;
};

/**
 * Blocking, unblocking and approving a store, from the list's row menu and from the store's page. Blocking asks
 * first (AD-Q5, AD-Q7); unblocking and approving run at once, both on `POST …/activate`. Each says how it went in
 * a one-line toast and refreshes the page from the backend, which decides when two admins act together. While a
 * request is out, `pending` names the store and its buttons are locked, so two presses send one request.
 */
export function useSellerActions() {
  const t = useTranslations("admin.sellers.actions");
  const router = useRouter();
  const [pending, setPending] = useState<string>();
  const [asking, setAsking] = useState<Target>();
  const [refreshing, startRefresh] = useTransition();
  const busy = useRef(false);

  function actionFor(seller: Target): StatusAction {
    if (seller.status === "active") {
      const label = t("block");
      return { kind: "block", label, menuLabel: t("blockMenu"), icon: BanIcon, destructive: true };
    }
    const kind = seller.status === "blocked" ? "unblock" : "approve";
    const label = t(kind);
    const icon = kind === "unblock" ? RotateCcwIcon : CheckIcon;
    return { kind, label, menuLabel: label, icon, destructive: false };
  }

  async function run(seller: Target, kind: StatusAction["kind"]) {
    if (busy.current) return;
    busy.current = true;
    setPending(seller.id);
    try {
      const path = { sellerId: seller.id };
      await (kind === "block" ? blockSeller({ path }) : activateSeller({ path }));
      startRefresh(() => router.refresh());
      showAdminToast(t(`done.${kind}`, { name: seller.name }));
    } catch {
      showAdminToast(t("failed", { name: seller.name }), "error");
    } finally {
      busy.current = false;
      setPending(undefined);
      setAsking(undefined);
    }
  }

  /** Does the store's action: asks before a block, runs the others at once. */
  function act(seller: Target) {
    const { kind } = actionFor(seller);
    if (kind === "block") setAsking(seller);
    else void run(seller, kind);
  }

  const dialog = (
    <ConfirmDialog
      open={asking !== undefined}
      onOpenChange={(open) => !open && setAsking(undefined)}
      title={t("confirm.title", { name: asking?.name ?? "" })}
      confirmLabel={t("block")}
      confirmIcon={BanIcon}
      destructive
      pending={pending !== undefined}
      onConfirm={() => asking && void run(asking, "block")}
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

  return { actionFor, act, pending, locked: pending !== undefined || refreshing, dialog };
}
