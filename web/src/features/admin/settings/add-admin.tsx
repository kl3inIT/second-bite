"use client";

import { ClockIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { type AccountBody, grantAdmin } from "@/lib/api/generated";

import { showAdminToast } from "../admin-toast";
import { ConfirmDialog, ConsequenceList } from "../ui/confirm-dialog";
import { addAdminProblem, adminRefusal } from "./admins";
import { TextField } from "./text-field";

/**
 * "Thêm quản trị viên" and its dialog (Figma AD-AM2): one email, checked once the field is left (an address, and
 * not an admin already), then `POST /admin/admins`. The address must have signed in once with a code; the backend
 * refuses one that has not (`IDENTITY_ADDRESS_UNPROVEN`), which a one-line toast says.
 */
export function AddAdmin({ admins }: { admins: readonly AccountBody[] }) {
  const t = useTranslations("admin.settings.admins");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [left, setLeft] = useState(false);
  const [pending, startGranting] = useTransition();
  const problem = email.trim() ? addAdminProblem(email, admins) : null;

  function openChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setEmail("");
      setLeft(false);
    }
  }

  function grant() {
    const address = email.trim();
    if (!address || problem) {
      setLeft(true);
      return;
    }
    if (pending) return;
    startGranting(async () => {
      try {
        await grantAdmin({ body: { email: address } });
        showAdminToast(t("granted", { email: address }));
        openChange(false);
        router.refresh();
      } catch (error) {
        const code = error instanceof ApiError ? error.code : undefined;
        showAdminToast(t(`refusals.${adminRefusal(code)}`, { email: address }), "error");
      }
    });
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>{t("add")}</Button>
      <ConfirmDialog
        open={open}
        onOpenChange={openChange}
        title={t("add")}
        confirmLabel={t("add")}
        confirmDisabled={!email.trim() || problem !== null}
        pending={pending}
        onConfirm={grant}
        form={
          <>
            <TextField
              id="add-admin-email"
              label={t("email")}
              type="email"
              autoComplete="off"
              value={email}
              onChange={setEmail}
              onBlur={() => setLeft(true)}
              error={left && problem ? t(`problems.${problem}`) : undefined}
            />
            <ConsequenceList items={[{ icon: ClockIcon, text: t("takesEffect") }]} />
          </>
        }
      />
    </>
  );
}
