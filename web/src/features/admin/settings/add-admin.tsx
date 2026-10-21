"use client";

import { ClockIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { ConfirmDialog, ConsequenceList } from "../ui/confirm-dialog";
import { type AdminGrant, addAdminProblem } from "./admins";
import { TextField } from "./text-field";

/**
 * "Thêm quản trị viên" and its dialog (Figma AD-AM2): one email, checked once the field is left (an address, and
 * not an admin already), and when the grant takes effect. SEC-75 has not built granting from the web yet, so the
 * dialog's action stays off with "Sắp có".
 */
export function AddAdmin({ admins }: { admins: readonly AdminGrant[] }) {
  const t = useTranslations("admin.settings.admins");
  const soon = useTranslations("admin.shell")("soon");
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [left, setLeft] = useState(false);
  const problem = email.trim() ? addAdminProblem(email, admins) : null;

  function openChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setEmail("");
      setLeft(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>{t("add")}</Button>
      <ConfirmDialog
        open={open}
        onOpenChange={openChange}
        title={t("add")}
        confirmLabel={t("add")}
        confirmDisabled
        confirmTitle={soon}
        onConfirm={() => undefined}
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
