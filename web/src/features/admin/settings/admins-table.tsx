"use client";

import { BanIcon, EllipsisIcon, ShieldIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { AccountBody } from "@/lib/api/generated";

import { initialsOf, revokeBlock, sameEmail } from "./admins";
import { RevokeAdminDialog } from "./revoke-admin-dialog";

/**
 * The admins (Figma AD-AM1): each address with its initials, as `GET /admin/admins` lists them. The backend keeps
 * no grant date, granter or first sign-in, so those columns of the design are not drawn. The ⋯ menu revokes,
 * locked with its reason for the viewer and for the last admin (AD-AM4), and opens the revoke dialog (AD-AM3).
 */
export function AdminsTable({
  rows,
  viewerEmail,
}: {
  rows: AccountBody[];
  /** The signed-in admin's address, to mark their row and keep them from revoking themselves. */
  viewerEmail?: string;
}) {
  const t = useTranslations("admin.settings.admins");
  const shell = useTranslations("admin.shell");
  const [revoking, setRevoking] = useState<AccountBody | null>(null);

  return (
    <>
      <Card>
        <Table>
          <caption className="sr-only">{t("caption")}</caption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-full">{t("columns.email")}</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const blocked = revokeBlock(row, rows, viewerEmail);
              const revoke = (
                <DropdownMenuItem
                  variant="destructive"
                  disabled={blocked !== null}
                  onClick={() => setRevoking(row)}
                >
                  <BanIcon aria-hidden />
                  {t("revoke")}
                </DropdownMenuItem>
              );
              return (
                <TableRow key={row.id}>
                  <TableCell className="w-full">
                    <span className="flex items-center gap-3">
                      <Avatar aria-hidden>
                        <AvatarFallback>{initialsOf(row.email)}</AvatarFallback>
                      </Avatar>
                      <span className="block max-w-80 truncate text-body-sm-strong text-foreground">
                        {viewerEmail && sameEmail(row.email, viewerEmail)
                          ? t("you", { email: row.email })
                          : row.email}
                      </span>
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={shell("rowActions", { name: row.email })}
                          />
                        }
                      >
                        <EllipsisIcon aria-hidden />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          {blocked ? (
                            // A disabled item takes no pointer, so its reason sits on what holds it.
                            <Tooltip>
                              <TooltipTrigger render={<div />}>{revoke}</TooltipTrigger>
                              <TooltipContent>{t(`revokeBlocked.${blocked}`)}</TooltipContent>
                            </Tooltip>
                          ) : (
                            revoke
                          )}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {rows.length === 0 && (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ShieldIcon aria-hidden />
              </EmptyMedia>
              <EmptyTitle>{t("empty")}</EmptyTitle>
            </EmptyHeader>
          </Empty>
        )}
      </Card>
      <RevokeAdminDialog
        admin={revoking}
        open={revoking !== null}
        onOpenChange={(open) => !open && setRevoking(null)}
      />
    </>
  );
}
