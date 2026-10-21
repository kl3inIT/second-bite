"use client";

import {
  CakeIcon,
  ClockIcon,
  CupSodaIcon,
  EllipsisIcon,
  GripVerticalIcon,
  type LucideIcon,
  PencilIcon,
  PlusIcon,
  ShapesIcon,
  SproutIcon,
  TagsIcon,
  Trash2Icon,
  UtensilsIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
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

import type { CategoryIcon, CategoryRow } from "./categories-source";
import { flattenTree } from "./tree";

const icons: Record<CategoryIcon, LucideIcon> = {
  bakery: CakeIcon,
  preparedFood: UtensilsIcon,
  drinks: CupSodaIcon,
  ingredients: SproutIcon,
  other: ShapesIcon,
};

/**
 * The categories (Figma AD-CD1): each group with its categories under it, how many posts are on sale in each,
 * whether customers see it, and its menu. Nothing can be changed until categories have a backend, so the switch
 * and the menu's actions say "Sắp có".
 */
export function CategoriesTable({ rows }: { rows: CategoryRow[] }) {
  const t = useTranslations("admin.settings.categories");
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
            <TableHead>{t("columns.posts")}</TableHead>
            <TableHead>{t("columns.visible")}</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {shown.map((row) => {
            const Icon = row.icon ? icons[row.icon] : undefined;
            return (
              <TableRow key={row.id}>
                <TableCell className="w-full">
                  <span className="flex items-center gap-3">
                    <GripVerticalIcon
                      aria-hidden
                      className="size-4 shrink-0 text-muted-foreground"
                    />
                    {row.depth > 0 ? (
                      <span aria-hidden className="w-6 shrink-0" />
                    ) : (
                      Icon && <Icon aria-hidden className="size-5 shrink-0 text-primary" />
                    )}
                    <span className="block max-w-80 truncate text-body-sm-strong text-foreground">
                      {row.name}
                    </span>
                    {row.opening && (
                      <Badge variant="outline">
                        <ClockIcon aria-hidden />
                        {t("opening")}
                      </Badge>
                    )}
                  </span>
                </TableCell>
                <TableCell>{t("posts", { count: row.postsOnSale })}</TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger render={<span />}>
                      <span className="flex items-center gap-2.5">
                        <Switch
                          checked={row.visible}
                          disabled
                          aria-label={t("toggle", { name: row.name })}
                        />
                        <span>{row.visible ? t("shown") : t("hidden")}</span>
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
                          {`${t("addChild")} · ${soon}`}
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" disabled>
                          <Trash2Icon aria-hidden />
                          {`${t("delete")} · ${soon}`}
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {shown.length === 0 && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <TagsIcon aria-hidden />
            </EmptyMedia>
            <EmptyTitle>{t("empty")}</EmptyTitle>
          </EmptyHeader>
        </Empty>
      )}
    </Card>
  );
}
