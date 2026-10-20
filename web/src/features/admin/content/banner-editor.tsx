"use client";

import { CheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Wordmark } from "@/components/wordmark";
import { Link } from "@/i18n/navigation";

import { AdminCrumb } from "../admin-crumbs";
import { adminHref } from "../pages";
import { ChoiceRow, GroupLabel, SwitchField, TextField } from "../ui/form-fields";
import type { StoreOption } from "../promotions/promotion-form";
import { SoonBadge } from "../ui/soon-badge";
import { FilterSelect } from "../ui/filter-bar";
import { PageHeader } from "../ui/page-header";
import { SegmentedControl } from "../ui/segmented-control";
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
import { BannerArt } from "./banner-art";

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
      <PageHeader
        title={editing ? t("editTitle") : t("newTitle")}
        actions={
          <>
            <Link href={adminHref("content")} className={buttonVariants({ variant: "neutral" })}>
              {t("cancel")}
            </Link>
            <SoonBadge id={soonId} />
            <Button disabled title={tShell("soon")} aria-describedby={soonId}>
              <CheckIcon data-icon="inline-start" aria-hidden />
              {t("save")}
            </Button>
          </>
        }
      />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <section
          aria-labelledby="banner-form-title"
          className="flex min-w-0 flex-1 flex-col gap-5 rounded-2xl border border-border bg-card p-6"
        >
          <h2 id="banner-form-title" className="text-title-lg text-foreground">
            {t("formTitle")}
          </h2>
          <BannerFields
            form={form}
            onChange={setForm}
            positions={(placement) => positionsIn(banners, placement, editing?.id)}
            collections={collections}
            stores={stores}
          />
        </section>
        <section
          aria-labelledby="banner-preview-title"
          className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 lg:w-110 lg:shrink-0"
        >
          <h2 id="banner-preview-title" className="text-title-lg text-foreground">
            {t("previewTitle")}
          </h2>
          <BannerPreview form={form} />
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

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <GroupLabel>{t("image")}</GroupLabel>
        <label
          htmlFor={`${id}-image`}
          className="relative flex cursor-pointer flex-col items-center gap-2 rounded-md border border-dashed border-secondary-hover bg-muted px-4 py-5 has-focus-visible:ring-3 has-focus-visible:ring-ring/50"
        >
          <BannerArt
            title={form.title || t("titlePlaceholder")}
            subtitle={form.subtitle}
            imageUrl={form.imageUrl}
          />
          <span className="text-center text-body-sm-strong text-primary">
            {form.imageUrl ? t("imageChange") : t("imageChoose")}
          </span>
          {/* The input lies over the whole zone, so a picture dropped anywhere on it is taken, as a press is. */}
          <input
            id={`${id}-image`}
            type="file"
            accept="image/*"
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={(event) => choose(event.target.files?.[0])}
          />
        </label>
      </div>

      <TextField
        id={`${id}-title`}
        label={t("title")}
        value={form.title}
        maxLength={bannerLimits.title}
        onChange={(title) => set({ title })}
        onBlur={() => setTouched((current) => ({ ...current, title: true }))}
        problem={touched.title && problems.includes("title") ? t("titleProblem") : undefined}
      />
      <TextField
        id={`${id}-subtitle`}
        label={t("subtitle")}
        value={form.subtitle}
        maxLength={bannerLimits.subtitle}
        onChange={(subtitle) => set({ subtitle })}
      />

      <div className="flex flex-col gap-1.5">
        <GroupLabel>{t("placement")}</GroupLabel>
        <FilterSelect
          label={t("placementField")}
          value={`${form.placement}:${form.position}`}
          options={places}
          onChange={(value) => {
            const [placement, position] = value.split(":");
            set({ placement: placement as BannerPlacement, position: Number(position) });
          }}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <GroupLabel>{t("link")}</GroupLabel>
        <ChoiceRow>
          <SegmentedControl<BannerLinkKind>
            label={t("link")}
            value={form.linkKind}
            segments={bannerLinkKinds.map((kind) => ({
              value: kind,
              label: t(`linkKinds.${kind}`),
            }))}
            onChange={(linkKind) => set({ linkKind, linkTarget: "" })}
          />
        </ChoiceRow>
        {form.linkKind === "url" ? (
          <TextField
            id={`${id}-url`}
            type="url"
            label={t("url")}
            value={form.linkTarget}
            placeholder="https://"
            onChange={(linkTarget) => set({ linkTarget })}
            onBlur={() => setTouched((current) => ({ ...current, link: true }))}
            problem={touched.link && problems.includes("link") ? t("urlProblem") : undefined}
          />
        ) : (
          <FilterSelect
            label={t(`linkKinds.${form.linkKind}`)}
            value={form.linkTarget}
            options={[{ value: "", label: t("noTarget") }, ...targets]}
            onChange={(linkTarget) => set({ linkTarget })}
          />
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <TextField
          id={`${id}-starts`}
          type="datetime-local"
          label={t("startsAt")}
          value={form.startsAt}
          onChange={(value) => value && setForm((current) => withBannerStart(current, value))}
        />
        <TextField
          id={`${id}-ends`}
          type="datetime-local"
          label={t("endsAt")}
          value={form.endsAt}
          min={form.startsAt}
          onChange={(value) => value && setForm((current) => withBannerEnd(current, value))}
        />
      </div>

      <SwitchField
        label={t("visible")}
        checked={form.visible}
        onChange={(visible) => set({ visible })}
      />
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
      <BannerArt
        title={form.title || t("titlePlaceholder")}
        subtitle={form.subtitle}
        imageUrl={form.imageUrl}
      />
      <p className="text-title-lg text-foreground">{t("previewShelf")}</p>
    </div>
  );
}
