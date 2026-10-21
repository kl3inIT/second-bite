"use client";

import { StoreIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useId, useState, useTransition } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { showAdminToast } from "@/features/admin/admin-toast";
import { adminHref } from "@/features/admin/pages";
import { FieldLabel, FieldProblem } from "@/features/admin/ui/form-fields";
import { FilterSelect } from "@/features/admin/ui/filter-bar";
import { SideSheet } from "@/features/admin/ui/side-sheet";
import { useRouter } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { uploadPhoto } from "@/lib/api/generated";

import {
  addressOf,
  MALL_ADDRESS,
  MALL_LOCATION,
  mallFloors,
  NAME_MAX,
  type OpenStoreDraft,
  type OpenStoreField,
  type OpenStoreProblems,
  openStoreProblems,
  problemOfFailure,
} from "./open-store";
import { openStoreForOwner, openStoreReady } from "./owner-actions";

const emptyDraft: OpenStoreDraft = { name: "", phone: "", floor: "Tầng 1", ownerEmail: "" };

/**
 * "Mở cửa hàng" on the stores list's header (Figma AD-OS1): an admin opens a store for its owner (SEC-64). The
 * page shows it only while the `openForOwner` flag is on.
 */
export function OpenStoreButton() {
  const t = useTranslations("admin.sellers.open");
  const [open, setOpen] = useState(false);
  const [round, setRound] = useState(0);
  return (
    <>
      <Button
        onClick={() => {
          // Each opening starts from an empty form.
          setRound((each) => each + 1);
          setOpen(true);
        }}
      >
        {t("button")}
      </Button>
      <OpenStoreSheet key={round} open={open} onOpenChange={setOpen} />
    </>
  );
}

/**
 * The sheet that opens a store for its owner (Figma AD-OS2, AD-OS4): the store's name, phone, floor of Tasco Mall,
 * photo and its owner's address. Each field says what is wrong with it once it was left, and a refusal of the
 * backend lands on its field ("Email này đã là chủ của 5 cửa hàng"). The store opens `active` and the page goes to
 * it with a one-line toast (AD-OS3). SEC-64 has not built the request, so "Mở cửa hàng" stays off with "Sắp có".
 */
function OpenStoreSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const ready = openStoreReady;
  const t = useTranslations("admin.sellers.open");
  const soon = useTranslations("admin.shell")("soon");
  const router = useRouter();
  const formId = useId();
  const [draft, setDraft] = useState(emptyDraft);
  const [photo, setPhoto] = useState<{ file: File; url: string }>();
  const [left, setLeft] = useState<ReadonlySet<OpenStoreField>>(new Set());
  const [refused, setRefused] = useState<OpenStoreProblems>({});
  const [pending, startTransition] = useTransition();

  const problems = openStoreProblems(draft);
  const shown: OpenStoreProblems = { ...pick(problems, left), ...refused };

  function change(next: Partial<OpenStoreDraft>) {
    setDraft((each) => ({ ...each, ...next }));
    // A refusal of the backend holds until its field is changed.
    setRefused((each) => {
      const rest = { ...each };
      for (const field of Object.keys(next) as (keyof OpenStoreDraft)[]) {
        delete rest[field === "floor" ? "address" : field];
      }
      return rest;
    });
  }

  function choose(file: File | undefined) {
    if (photo) URL.revokeObjectURL(photo.url);
    setPhoto(file && { file, url: URL.createObjectURL(file) });
  }

  function submit() {
    setLeft(new Set(["name", "phone", "address", "ownerEmail"]));
    if (!ready || pending || Object.keys(problems).length > 0) return;
    const name = draft.name.trim();
    startTransition(async () => {
      try {
        const photoId = photo ? (await uploadPhoto({ body: photo.file })).data.id : undefined;
        const seller = await openStoreForOwner({
          name,
          phone: draft.phone.trim(),
          address: addressOf(draft.floor),
          ...MALL_LOCATION,
          ownerEmail: draft.ownerEmail.trim(),
          photoId,
        });
        onOpenChange(false);
        showAdminToast(t("done", { name }));
        router.push(adminHref("sellerDetail", { sellerId: seller.id }));
      } catch (error) {
        const refusal = problemOfFailure(error instanceof ApiError ? error.code : undefined);
        if (refusal) setRefused({ [refusal.field]: refusal.problem });
        else showAdminToast(t("failed", { name }), "error");
      }
    });
  }

  return (
    <SideSheet
      open={open}
      onOpenChange={(next) => !pending && onOpenChange(next)}
      title={t("title")}
      footer={
        <>
          <Button variant="neutral" disabled={pending} onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button
            type="submit"
            form={formId}
            disabled={!ready || pending}
            title={ready ? undefined : soon}
          >
            {pending && <Spinner data-icon="inline-start" />}
            {t("submit")}
          </Button>
        </>
      }
    >
      <form
        id={formId}
        noValidate
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <OpenStoreFields
          draft={draft}
          problems={shown}
          photoUrl={photo?.url}
          disabled={pending}
          onChange={change}
          onLeave={(field) => setLeft((each) => new Set(each).add(field))}
          onPhoto={choose}
        />
      </form>
    </SideSheet>
  );
}

function pick(problems: OpenStoreProblems, fields: ReadonlySet<OpenStoreField>): OpenStoreProblems {
  return Object.fromEntries(
    Object.entries(problems).filter(([field]) => fields.has(field as OpenStoreField)),
  );
}

/**
 * The form's fields (Figma AD-OS2 body): a label over each and its problem under it in red, never a helper line.
 * The address is a floor picked from Tasco Mall's and the mall's own address, which cannot be changed.
 */
export function OpenStoreFields({
  draft,
  problems,
  photoUrl,
  disabled = false,
  onChange,
  onLeave,
  onPhoto,
}: {
  draft: OpenStoreDraft;
  problems: OpenStoreProblems;
  photoUrl?: string;
  disabled?: boolean;
  onChange: (change: Partial<OpenStoreDraft>) => void;
  onLeave: (field: OpenStoreField) => void;
  onPhoto: (file: File | undefined) => void;
}) {
  const t = useTranslations("admin.sellers.open");
  const id = useId();
  const say = (field: OpenStoreField) => {
    const problem = problems[field];
    return problem && t(`problems.${problem}`, { max: NAME_MAX });
  };

  return (
    <>
      <Field
        id={`${id}-name`}
        label={t("name")}
        value={draft.name}
        maxLength={NAME_MAX}
        autoComplete="organization"
        problem={say("name")}
        disabled={disabled}
        onChange={(name) => onChange({ name })}
        onBlur={() => onLeave("name")}
      />
      <Field
        id={`${id}-phone`}
        label={t("phone")}
        type="tel"
        value={draft.phone}
        autoComplete="tel"
        problem={say("phone")}
        disabled={disabled}
        onChange={(phone) => onChange({ phone })}
        onBlur={() => onLeave("phone")}
      />
      <div className="flex flex-col gap-1.5">
        <FieldLabel htmlFor={`${id}-mall`}>{t("address")}</FieldLabel>
        <div className="flex flex-wrap items-center gap-3">
          <FilterSelect
            label={t("floor")}
            value={draft.floor}
            options={mallFloors.map((floor) => ({ value: floor, label: floor }))}
            onChange={(floor) => onChange({ floor })}
          />
          <div className="min-w-48 flex-1">
            <InputGroup surface="admin">
              <InputGroupInput id={`${id}-mall`} value={MALL_ADDRESS} disabled readOnly />
            </InputGroup>
          </div>
        </div>
        {say("address") && <FieldProblem id={`${id}-mall-problem`}>{say("address")}</FieldProblem>}
      </div>
      <div className="flex flex-col gap-1.5">
        <FieldLabel htmlFor={`${id}-photo`}>{t("photo")}</FieldLabel>
        <div className="flex items-center gap-4">
          <span className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted text-muted-foreground">
            {photoUrl ? (
              <Image src={photoUrl} alt="" fill sizes="64px" unoptimized className="object-cover" />
            ) : (
              <StoreIcon aria-hidden className="size-6" />
            )}
          </span>
          <label className={buttonVariants({ variant: "neutral" })}>
            {photoUrl ? t("changePhoto") : t("choosePhoto")}
            <input
              id={`${id}-photo`}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              disabled={disabled}
              onChange={(event) => onPhoto(event.target.files?.[0])}
            />
          </label>
        </div>
      </div>
      <Field
        id={`${id}-email`}
        label={t("email")}
        type="email"
        value={draft.ownerEmail}
        autoComplete="off"
        problem={say("ownerEmail")}
        disabled={disabled}
        onChange={(ownerEmail) => onChange({ ownerEmail })}
        onBlur={() => onLeave("ownerEmail")}
      />
    </>
  );
}

// A line of the form in the admin's 44px field, its label above and its problem below (Figma Admin/FormField).
function Field({
  id,
  label,
  value,
  type = "text",
  maxLength,
  autoComplete,
  problem,
  disabled,
  onChange,
  onBlur,
}: {
  id: string;
  label: string;
  value: string;
  type?: "text" | "tel" | "email";
  maxLength?: number;
  autoComplete: string;
  problem?: string;
  disabled: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup surface="admin">
        <InputGroupInput
          id={id}
          type={type}
          inputMode={type === "tel" ? "tel" : type === "email" ? "email" : undefined}
          value={value}
          maxLength={maxLength}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={problem ? true : undefined}
          aria-describedby={problem ? `${id}-problem` : undefined}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
        />
      </InputGroup>
      {problem && <FieldProblem id={`${id}-problem`}>{problem}</FieldProblem>}
    </div>
  );
}
