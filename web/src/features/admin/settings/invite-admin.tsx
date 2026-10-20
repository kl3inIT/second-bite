"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { ConfirmDialog } from "../ui/confirm-dialog";
import { type AdminRole, adminRoles } from "./admin-rows";
import { TextField } from "./text-field";

/**
 * "Mời quản trị viên" and its dialog (Figma AD-CD4): an email and one of four roles. The dialog opens and takes
 * both, but invitations have no backend yet, so "Gửi lời mời" stays off with "Sắp có" (docs: admin-qa, 21 October
 * 2026). Roles are the Figma's proposal; the backend has only `admin`.
 */
export function InviteAdmin() {
  const t = useTranslations("admin.settings.admins");
  const soon = useTranslations("admin.shell")("soon");
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AdminRole>("operations");

  return (
    <>
      <Button onClick={() => setOpen(true)}>{t("invite")}</Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={t("invite")}
        confirmLabel={t("send")}
        confirmDisabled
        confirmTitle={soon}
        onConfirm={() => undefined}
        form={
          <>
            <TextField
              id="invite-email"
              label={t("email")}
              type="email"
              autoComplete="off"
              value={email}
              onChange={setEmail}
            />
            <div className="flex flex-col gap-1.5">
              <span id="invite-role" className="text-label-strong text-foreground">
                {t("role")}
              </span>
              <RadioGroup
                aria-labelledby="invite-role"
                value={role}
                onValueChange={(value) => setRole(value as AdminRole)}
              >
                {adminRoles.map((each) => (
                  <label
                    key={each}
                    className="flex min-h-14 cursor-pointer items-center gap-3 rounded-md border border-border bg-card px-4 text-body-sm-strong text-foreground transition-colors hover:bg-muted has-data-checked:border-primary has-data-checked:bg-secondary has-data-checked:text-primary"
                  >
                    <RadioGroupItem value={each} />
                    {t(`roles.${each}`)}
                  </label>
                ))}
              </RadioGroup>
            </div>
          </>
        }
      />
    </>
  );
}
