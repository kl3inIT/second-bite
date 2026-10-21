"use client";

import { EllipsisIcon, MapPinIcon, PencilIcon, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

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
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import type { AreaRow } from "./areas-source";
import { flattenTree } from "./tree";

/**
 * The areas (Figma AD-CD2): each mall with its floors under it, how many stores are in each, and whether it takes
 * new stores. Nothing can be changed until areas have a backend, so the switch and the menu say "Sắp có".
 */
export function AreasTable({ rows }: { rows: AreaRow[] }) {
  const t = useTranslations("admin.settings.areas");
  const shell = useTranslations("admin.shell");
  const soon = shell("soon");
  const shown = flattenTree(rows);

  return (
    <Card>
      <Table>
        <caption className="sr-only">{t("caption")}</caption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-full">{t("columns.name")}</TableHead>
            <TableHead>{t("columns.sellers")}</TableHead>
            <TableHead>{t("columns.open")}</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {shown.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="w-full">
                <span className="flex items-center gap-3">
                  {row.depth === 0 ? (
                    <MapPinIcon aria-hidden className="size-5 shrink-0 text-primary" />
                  ) : (
                    <span aria-hidden className="w-5 shrink-0" />
                  )}
                  <span className="block max-w-80 truncate text-body-sm-strong text-foreground">
                    {row.name}
                  </span>
                </span>
              </TableCell>
              <TableCell>{t("sellers", { count: row.sellers })}</TableCell>
              <TableCell>
                <Tooltip>
                  <TooltipTrigger render={<span />}>
                    <span className="flex items-center gap-2.5">
                      <Switch
                        checked={row.open}
                        disabled
                        aria-label={t("toggle", { name: row.name })}
                      />
                      <span>{row.open ? t("open") : t("paused")}</span>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{soon}</TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={shell("rowActions", { name: row.name })}
                      />
                    }
                  >
                    <EllipsisIcon aria-hidden />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuGroup>
                      <DropdownMenuItem disabled>
                        <PencilIcon aria-hidden />
                        {`${t("edit")} · ${soon}`}
                      </DropdownMenuItem>
                      <DropdownMenuItem disabled>
                        <PlusIcon aria-hidden />
                        {`${t("addFloor")} · ${soon}`}
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {shown.length === 0 && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MapPinIcon aria-hidden />
            </EmptyMedia>
            <EmptyTitle>{t("empty")}</EmptyTitle>
          </EmptyHeader>
        </Empty>
      )}
    </Card>
  );
}
