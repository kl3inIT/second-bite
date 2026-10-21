"use client";

import { StoreIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useId, useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { adminHref } from "@/features/admin/pages";
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
  const shell = useTranslations("admin.shell");
  const router = useRouter();
  const formId = useId();
  const soonId = useId();
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
        toast.add({ title: t("done", { name }), type: "success", timeout: 5000 });
        router.push(adminHref("sellerDetail", { sellerId: seller.id }));
      } catch (error) {
        const refusal = problemOfFailure(error instanceof ApiError ? error.code : undefined);
        if (refusal) setRefused({ [refusal.field]: refusal.problem });
        else toast.add({ title: t("failed", { name }), type: "error", timeout: 5000 });
      }
    });
  }

  const submitButton = (
    <Button
      type="submit"
      form={formId}
      disabled={!ready || pending}
      aria-describedby={ready ? undefined : soonId}
    >
      {pending && <Spinner data-icon="inline-start" />}
      {t("submit")}
    </Button>
  );

  return (
    <Sheet open={open} onOpenChange={(next) => !pending && onOpenChange(next)}>
      <SheetContent side="right" size="wide" showCloseButton={false}>
        <SheetHeader variant="bar" className="items-center justify-between">
          <SheetTitle variant="headline">{t("title")}</SheetTitle>
          <SheetClose
            render={<Button variant="ghost" size="icon" aria-label={shell("sheetClose")} />}
          >
            <XIcon aria-hidden />
          </SheetClose>
        </SheetHeader>
        <form
          id={formId}
          noValidate
          className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6"
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
        <SheetFooter variant="bar">
          <Button variant="outline" disabled={pending} onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          {ready ? (
            submitButton
          ) : (
            // A disabled button takes no pointer, so its "Sắp có" sits on a wrapper the pointer reaches.
            <Tooltip>
              <TooltipTrigger render={<span />}>{submitButton}</TooltipTrigger>
              <TooltipContent>{shell("soon")}</TooltipContent>
            </Tooltip>
          )}
          <span id={soonId} className="sr-only">
            {shell("soon")}
          </span>
        </SheetFooter>
      </SheetContent>
    </Sheet>
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
  const photoInput = useRef<HTMLInputElement>(null);
  const say = (field: OpenStoreField) => {
    const problem = problems[field];
    return problem && t(`problems.${problem}`, { max: NAME_MAX });
  };
  const floors = mallFloors.map((floor) => ({ value: floor, label: floor }));

  // One line of the form: its label, the field, and what is wrong with it under it.
  const line = (
    field: "name" | "phone" | "ownerEmail",
    label: string,
    type: "text" | "tel" | "email",
    autoComplete: string,
  ) => {
    const fieldId = `${id}-${field === "ownerEmail" ? "email" : field}`;
    const problem = say(field);
    return (
      <Field data-invalid={problem ? true : undefined}>
        <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
        <Input
          id={fieldId}
          type={type}
          inputMode={type === "tel" ? "tel" : type === "email" ? "email" : undefined}
          value={draft[field]}
          maxLength={field === "name" ? NAME_MAX : undefined}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={problem ? true : undefined}
          aria-describedby={problem ? `${fieldId}-problem` : undefined}
          onChange={(event) => onChange({ [field]: event.target.value })}
          onBlur={() => onLeave(field)}
        />
        {problem && <FieldError id={`${fieldId}-problem`}>{problem}</FieldError>}
      </Field>
    );
  };

  return (
    <>
      {line("name", t("name"), "text", "organization")}
      {line("phone", t("phone"), "tel", "tel")}
      <Field>
        <FieldLabel htmlFor={`${id}-mall`}>{t("address")}</FieldLabel>
        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={draft.floor}
            items={floors}
            onValueChange={(floor) => {
              if (typeof floor === "string") onChange({ floor });
            }}
          >
            <SelectTrigger aria-labelledby={`${id}-floor`}>
              <span id={`${id}-floor`} className="text-muted-foreground">
                {t("floor")}:
              </span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} align="start">
              {floors.map((floor) => (
                <SelectItem key={floor.value} value={floor.value}>
                  {floor.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="min-w-48 flex-1">
            <Input id={`${id}-mall`} value={MALL_ADDRESS} disabled readOnly />
          </div>
        </div>
        {say("address") && <FieldError id={`${id}-mall-problem`}>{say("address")}</FieldError>}
      </Field>
      <Field>
        <FieldLabel htmlFor={`${id}-photo`}>{t("photo")}</FieldLabel>
        <div className="flex items-center gap-4">
          <span className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted text-muted-foreground">
            {photoUrl ? (
              <Image src={photoUrl} alt="" fill sizes="64px" unoptimized className="object-cover" />
            ) : (
              <StoreIcon aria-hidden className="size-6" />
            )}
          </span>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={() => photoInput.current?.click()}
          >
            {photoUrl ? t("changePhoto") : t("choosePhoto")}
          </Button>
          <input
            ref={photoInput}
            id={`${id}-photo`}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            tabIndex={-1}
            disabled={disabled}
            onChange={(event) => onPhoto(event.target.files?.[0])}
          />
        </div>
      </Field>
      {line("ownerEmail", t("email"), "email", "off")}
    </>
  );
}
