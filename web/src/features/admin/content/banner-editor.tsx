"use client";

import { ArrowRightIcon, CheckIcon, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Wordmark } from "@/components/wordmark";
import { Link } from "@/i18n/navigation";

import { AdminCrumb } from "../admin-crumbs";
import { adminHref } from "../pages";
import type { StoreOption } from "../promotions/promotion-form";
import {
  type BannerForm,
  type BannerLinkKind,
  bannerLimits,
  bannerLinkKinds,
  type BannerPlacement,
  bannerPlacements,
  bannerProblems,
  type BannerRow,
  blankBanner,
  type Collection,
  positionsIn,
  withBannerEnd,
  withBannerStart,
} from "./banner";

/**
 * Adding or changing a banner (Figma AD-MK4): its picture, title and line under it, where it shows, what it
 * opens, from when to when, and whether it shows; beside it the banner as the app's home page will draw it. The
 * end is held at or after the start. No backend keeps banners yet, so "Lưu banner" stays disabled beside "Sắp có"
 * and a chosen picture stays in this browser.
 */
export function BannerEditor({
  editing,
  initial,
  banners,
  collections,
  stores,
}: {
  /** The banner being changed, or none for a new one. */
  editing?: BannerRow;
  /** The banner's values, or none to start a new one from tomorrow. */
  initial?: BannerForm;
  banners: BannerRow[];
  collections: Collection[];
  stores: StoreOption[];
}) {
  const t = useTranslations("admin.content.editor");
  const tShell = useTranslations("admin.shell");
  const soonId = useId();
  const [form, setForm] = useState(() => initial ?? blankBanner(new Date()));

  return (
    <>
      <AdminCrumb label={editing ? editing.title : t("newCrumb")} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-page-title text-foreground">
          {editing ? t("editTitle") : t("newTitle")}
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <Link href={adminHref("content")} className={buttonVariants({ variant: "outline" })}>
            {t("cancel")}
          </Link>
          <Badge variant="outline" id={soonId}>
            {tShell("soon")}
          </Badge>
          <Button disabled aria-describedby={soonId}>
            <CheckIcon data-icon="inline-start" aria-hidden />
            {t("save")}
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <section aria-labelledby="banner-form-title" className="min-w-0 flex-1">
          <Card>
            <CardHeader>
              <CardTitle>
                <h2 id="banner-form-title">{t("formTitle")}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-5">
                <BannerFields
                  form={form}
                  onChange={setForm}
                  positions={(placement) => positionsIn(banners, placement, editing?.id)}
                  collections={collections}
                  stores={stores}
                />
              </div>
            </CardContent>
          </Card>
        </section>
        <section aria-labelledby="banner-preview-title" className="lg:w-110 lg:shrink-0">
          <Card>
            <CardHeader>
              <CardTitle>
                <h2 id="banner-preview-title">{t("previewTitle")}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BannerPreview form={form} />
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}

/** The editor's fields, top to bottom as Figma AD-MK4 draws them. `onChange` takes the next form from the last. */
export function BannerFields({
  form,
  onChange: setForm,
  positions,
  collections,
  stores,
}: {
  form: BannerForm;
  onChange: (next: (current: BannerForm) => BannerForm) => void;
  positions: (placement: BannerPlacement) => number[];
  collections: Collection[];
  stores: StoreOption[];
}) {
  const t = useTranslations("admin.content.editor");
  const tContent = useTranslations("admin.content");
  const id = useId();
  const [touched, setTouched] = useState({ title: false, link: false });
  const problems = bannerProblems(form);
  const set = (change: Partial<BannerForm>) => setForm((current) => ({ ...current, ...change }));
  const titleProblem = touched.title && problems.includes("title");
  const urlProblem = touched.link && problems.includes("link");

  const choose = (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (form.imageUrl?.startsWith("blob:")) URL.revokeObjectURL(form.imageUrl);
    set({ imageUrl: URL.createObjectURL(file) });
  };

  const places = bannerPlacements.flatMap((placement) =>
    positions(placement).map((position) => ({
      value: `${placement}:${position}`,
      label: t("place", { place: tContent(`placements.${placement}`), position }),
    })),
  );
  const targets =
    form.linkKind === "store"
      ? stores.map((store) => ({ value: store.id, label: store.name }))
      : collections.map((collection) => ({ value: collection.id, label: collection.name }));

  // The two selects of the form: where the banner shows, and the store or collection it opens.
  const selects = [
    {
      key: "placement",
      label: t("placementField"),
      value: `${form.placement}:${form.position}`,
      options: places,
      onChange: (value: string) => {
        const [placement, position] = value.split(":");
        set({ placement: placement as BannerPlacement, position: Number(position) });
      },
    },
    {
      key: "target",
      label: t(`linkKinds.${form.linkKind}`),
      value: form.linkTarget,
      options: [{ value: "", label: t("noTarget") }, ...targets],
      onChange: (linkTarget: string) => set({ linkTarget }),
    },
  ];
  const [placementSelect, targetSelect] = selects.map((select) => (
    <Select
      key={select.key}
      value={select.value}
      items={select.options}
      onValueChange={(next) => {
        if (typeof next === "string") select.onChange(next);
      }}
    >
      <SelectTrigger aria-labelledby={`${id}-${select.key}`}>
        <span id={`${id}-${select.key}`} className="text-muted-foreground">
          {select.label}:
        </span>
        <span className="text-body-sm-strong text-foreground">
          <SelectValue />
        </span>
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} align="start">
        {select.options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ));

  return (
    <>
      <Field>
        <FieldLabel htmlFor={`${id}-image`}>{t("image")}</FieldLabel>
        {/* The input lies over the whole zone, so a picture dropped anywhere on it is taken, as a press is. */}
        <div className="relative flex flex-col items-center gap-2">
          <Item variant="muted">
            <ItemContent className="min-w-0">
              <ItemTitle>{form.title || t("titlePlaceholder")}</ItemTitle>
              <ItemDescription>{form.subtitle}</ItemDescription>
            </ItemContent>
            <ItemMedia variant="image">
              {form.imageUrl ? (
                // Unoptimized: a picture the admin just chose lives only in this browser until it is uploaded.
                <Image src={form.imageUrl} alt="" width={84} height={60} unoptimized />
              ) : (
                <ImageIcon aria-hidden />
              )}
            </ItemMedia>
          </Item>
          <span className="text-center text-body-sm-strong text-primary">
            {form.imageUrl ? t("imageChange") : t("imageChoose")}
          </span>
          <input
            id={`${id}-image`}
            type="file"
            accept="image/*"
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={(event) => choose(event.target.files?.[0])}
          />
        </div>
      </Field>

      <Field data-invalid={titleProblem || undefined}>
        <FieldLabel htmlFor={`${id}-title`}>{t("title")}</FieldLabel>
        <Input
          id={`${id}-title`}
          value={form.title}
          maxLength={bannerLimits.title}
          autoComplete="off"
          aria-invalid={titleProblem || undefined}
          aria-describedby={titleProblem ? `${id}-title-problem` : undefined}
          onChange={(event) => set({ title: event.target.value })}
          onBlur={() => setTouched((current) => ({ ...current, title: true }))}
        />
        {titleProblem && <FieldError id={`${id}-title-problem`}>{t("titleProblem")}</FieldError>}
      </Field>
      <Field>
        <FieldLabel htmlFor={`${id}-subtitle`}>{t("subtitle")}</FieldLabel>
        <Input
          id={`${id}-subtitle`}
          value={form.subtitle}
          maxLength={bannerLimits.subtitle}
          autoComplete="off"
          onChange={(event) => set({ subtitle: event.target.value })}
        />
      </Field>

      <FieldSet>
        <FieldLegend variant="label">{t("placement")}</FieldLegend>
        {placementSelect}
      </FieldSet>

      <FieldSet>
        <FieldLegend variant="label">{t("link")}</FieldLegend>
        <ToggleGroup
          variant="outline"
          value={[form.linkKind]}
          onValueChange={([linkKind]) => {
            if (linkKind) set({ linkKind: linkKind as BannerLinkKind, linkTarget: "" });
          }}
          className="max-w-full overflow-x-auto"
        >
          {bannerLinkKinds.map((kind) => (
            <ToggleGroupItem key={kind} value={kind} className="h-11">
              {t(`linkKinds.${kind}`)}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        {form.linkKind === "url" ? (
          <Field data-invalid={urlProblem || undefined}>
            <FieldLabel htmlFor={`${id}-url`}>{t("url")}</FieldLabel>
            <Input
              id={`${id}-url`}
              type="url"
              value={form.linkTarget}
              placeholder="https://"
              autoComplete="off"
              aria-invalid={urlProblem || undefined}
              aria-describedby={urlProblem ? `${id}-url-problem` : undefined}
              onChange={(event) => set({ linkTarget: event.target.value })}
              onBlur={() => setTouched((current) => ({ ...current, link: true }))}
            />
            {urlProblem && <FieldError id={`${id}-url-problem`}>{t("urlProblem")}</FieldError>}
          </Field>
        ) : (
          targetSelect
        )}
      </FieldSet>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Field>
          <FieldLabel htmlFor={`${id}-starts`}>{t("startsAt")}</FieldLabel>
          <Input
            id={`${id}-starts`}
            type="datetime-local"
            value={form.startsAt}
            onChange={(event) => {
              const value = event.target.value;
              if (value) setForm((current) => withBannerStart(current, value));
            }}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor={`${id}-ends`}>{t("endsAt")}</FieldLabel>
          <Input
            id={`${id}-ends`}
            type="datetime-local"
            value={form.endsAt}
            min={form.startsAt}
            onChange={(event) => {
              const value = event.target.value;
              if (value) setForm((current) => withBannerEnd(current, value));
            }}
          />
        </Field>
      </div>

      <Field orientation="horizontal" className="min-h-11">
        <Switch
          id={`${id}-visible`}
          checked={form.visible}
          onCheckedChange={(visible) => set({ visible })}
        />
        <FieldLabel htmlFor={`${id}-visible`}>{t("visible")}</FieldLabel>
      </Field>
    </>
  );
}

/**
 * The banner on a phone's home page (Figma AD-MK4 › Xem trước trên app): the wordmark, the search field, the
 * banner as it is being written, and the next shelf's name.
 */
export function BannerPreview({ form }: { form: BannerForm }) {
  const t = useTranslations("admin.content.editor");
  return (
    <div className="flex w-full max-w-97.5 flex-col gap-3.5 rounded-4xl border-6 border-border bg-muted px-4 pt-5 pb-6">
      <Wordmark className="text-primary" />
      <div
        aria-hidden
        className="flex h-11 items-center rounded-full bg-card px-4 text-body-sm text-muted-foreground"
      >
        {t("previewSearch")}
      </div>
      <Item variant="outline">
        <ItemContent className="min-w-0">
          <ItemTitle>{form.title || t("titlePlaceholder")}</ItemTitle>
          <ItemDescription>{form.subtitle}</ItemDescription>
        </ItemContent>
        <ItemMedia variant="image">
          {form.imageUrl ? (
            <Image src={form.imageUrl} alt="" width={84} height={60} unoptimized />
          ) : (
            <ImageIcon aria-hidden />
          )}
        </ItemMedia>
        <ArrowRightIcon aria-hidden />
      </Item>
      <p className="text-title-lg text-foreground">{t("previewShelf")}</p>
    </div>
  );
}
