"use client";

import { ClockIcon, UsersIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { type AdminMember, initialsOf, roleTone } from "./member";
import { toneBadge } from "./seller-list";

/**
 * A store's members tab (Figma AD-QD4): its owner and staff with their address, role and the day they joined.
 * The backend keeps no name for an account and does not count who posted what, so the table shows the address
 * and leaves out Figma's "Bài đã đăng". The address writes to them. An owner who has not signed in yet carries
 * "Chờ đăng nhập" beside their role (AD-OS3).
 */
export function SellerMembers({ members }: { members: AdminMember[] }) {
  const t = useTranslations("admin.sellers.detail");
  const format = useFormatter();
  if (members.length === 0) {
    return (
      <Empty surface="card">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <UsersIcon aria-hidden />
          </EmptyMedia>
          <EmptyTitle>{t("members.empty")}</EmptyTitle>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <Card>
      <Table>
        <caption className="sr-only">{t("members.caption")}</caption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-full">{t("members.columns.member")}</TableHead>
            <TableHead>{t("members.columns.role")}</TableHead>
            <TableHead>{t("members.columns.added")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => {
            const added = new Date(member.addedAt);
            return (
              <TableRow key={member.accountId}>
                <TableCell className="w-full">
                  <span className="flex items-center gap-2.5">
                    <Avatar aria-hidden>
                      <AvatarFallback tone={member.role === "owner" ? "indigo" : "muted"}>
                        {initialsOf(member.email)}
                      </AvatarFallback>
                    </Avatar>
                    <a
                      href={`mailto:${member.email}`}
                      className="block max-w-80 truncate text-body-sm-strong text-foreground hover:underline"
                    >
                      {member.email}
                    </a>
                  </span>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-2">
                    {member.awaitingSignIn && (
                      <Badge variant={toneBadge.neutral}>
                        <ClockIcon aria-hidden />
                        {t("members.awaitingSignIn")}
                      </Badge>
                    )}
                    <Badge variant={toneBadge[roleTone[member.role]]}>
                      {t(`roles.${member.role}`)}
                    </Badge>
                  </span>
                </TableCell>
                <TableCell>
                  <time dateTime={added.toISOString()} className="text-muted-foreground">
                    {format.dateTime(added, "day")}
                  </time>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
