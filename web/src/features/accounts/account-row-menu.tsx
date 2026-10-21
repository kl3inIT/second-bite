"use client";

import { EllipsisIcon, EyeIcon, ShieldMinusIcon, ShieldPlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "@/i18n/navigation";
import type { RecordBody } from "@/lib/api/generated";

import { nameOf } from "./account-parts";
import { ChangeRoleDialog, roleChangeOf } from "./role-action";

/**
 * A row's actions in the admins' tables (SEC-75), behind "⋯" as BeyondPilot's and most admin tables put
 * them: the account's page, then making it an admin or a customer again, which asks first. A revoke the
 * server would refuse stays in the menu, disabled, with its reason. The trigger names the account for
 * screen readers; its tooltip names the control for those pointing at it.
 */
export function AccountRowMenu({
  account,
  myId,
  adminCount,
}: {
  account: RecordBody;
  myId: string;
  adminCount: number;
}) {
  const t = useTranslations("Admin.accounts.menu");
  const admins = useTranslations("Admin.admins");
  const [asking, setAsking] = useState(false);
  const name = nameOf(account);
  const role = roleChangeOf(account, myId, adminCount);
  const grant = "change" in role && role.change === "grant";
  const Icon = grant ? ShieldPlusIcon : ShieldMinusIcon;

  return (
    <>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger
            render={
              <DropdownMenuTrigger
                render={<Button variant="ghost" size="icon" aria-label={t("open", { name })} />}
              />
            }
          >
            <EllipsisIcon aria-hidden />
          </TooltipTrigger>
          <TooltipContent>{t("tooltip")}</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end" className="min-w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem render={<Link href={`/admin/accounts/${account.id}`} />}>
              <EyeIcon aria-hidden />
              {t("view")}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              variant={grant ? "default" : "destructive"}
              disabled={"refused" in role}
              onClick={() => setAsking(true)}
            >
              <Icon aria-hidden />
              <span className="flex flex-col">
                {t(grant ? "grant" : "revoke")}
                {"refused" in role && (
                  <span className="text-label text-muted-foreground">
                    {admins(`revoke.${role.refused}`)}
                  </span>
                )}
              </span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {"change" in role && (
        <ChangeRoleDialog
          key={role.change}
          account={account}
          change={role.change}
          open={asking}
          onOpenChange={setAsking}
        />
      )}
    </>
  );
}
