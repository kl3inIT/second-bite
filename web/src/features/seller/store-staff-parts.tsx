"use client";

import { revalidateLogic } from "@tanstack/react-form";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { z } from "zod";

import { refuse, useAppForm } from "@/components/form/app-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useRouter } from "@/i18n/navigation";
import { failureOf } from "@/lib/api/client";
import { addSellerStaff, type MemberBody, removeSellerMember } from "@/lib/api/generated";

/** Two letters of an address's name part, for a person's avatar. */
function initialsOf(email: string) {
  const parts =
    email
      .split("@")[0]
      ?.split(/[._-]+/)
      .filter(Boolean) ?? [];
  return (
    parts.length > 1 ? parts[0][0] + parts[1][0] : (parts[0] ?? "?").slice(0, 2)
  ).toUpperCase();
}

/**
 * The owner's form (Figma N1): an address becomes staff at once, and signs in with an emailed code to it. The
 * server's refusal of the address, or of a person already there, stays under the field.
 */
export function AddStaffForm({ sellerId }: { sellerId: string }) {
  const t = useTranslations("StoreStaffPage");
  const router = useRouter();

  const form = useAppForm({
    defaultValues: { email: "" },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: z.object({
        email: z
          .string()
          .trim()
          .pipe(z.email({ message: t("errors.email") })),
      }),
    },
    onSubmit: async ({ value, formApi }) => {
      const email = value.email.trim();
      try {
        await addSellerStaff({ path: { sellerId }, body: { email } });
      } catch (error) {
        refuse(formApi, error, {
          IDENTITY_EMAIL_INVALID: "email",
          IDENTITY_ADDRESS_UNPROVEN: "email",
          SELLER_ALREADY_MEMBER: "email",
        });
        return;
      }
      toast.add({ type: "success", title: t("added", { email }) });
      formApi.reset();
      router.refresh();
    },
  });

  return (
    <form
      id={form.formId}
      noValidate
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.AppField name="email">
        {(field) => (
          <field.TextField
            label={t("email")}
            required
            type="email"
            autoComplete="off"
            inputMode="email"
            placeholder={t("emailPlaceholder")}
          />
        )}
      </form.AppField>
      <form.AppForm>
        <form.FormError fallback={t("failed")} />
        <form.SubmitButton size="lg">{t("add")}</form.SubmitButton>
      </form.AppForm>
    </form>
  );
}

/**
 * Everyone in the store (Figma N1, N3): the owner with their badge, then staff. The owner removes staff, and
 * staff leave from their own row; both ask first (N2).
 */
export function StaffList({
  sellerId,
  storeName,
  members,
  myId,
  owner,
}: {
  sellerId: string;
  storeName: string;
  members: MemberBody[];
  myId: string;
  owner: boolean;
}) {
  const t = useTranslations("StoreStaffPage");

  return (
    <section aria-labelledby="store-people" className="flex flex-col gap-3">
      <h2 id="store-people" className="text-title text-foreground">
        {t("people", { count: members.length })}
      </h2>
      <ul className="flex flex-col gap-3">
        {members.map((member) => {
          const mine = member.accountId === myId;
          return (
            <li key={member.accountId} className="flex min-h-11 items-center gap-3">
              <Avatar>
                <AvatarFallback tone={member.role === "owner" ? "indigo" : "muted"}>
                  {initialsOf(member.email)}
                </AvatarFallback>
              </Avatar>
              <span className="min-w-0 flex-1 truncate text-body-sm text-foreground">
                {mine ? t("you", { email: member.email }) : member.email}
              </span>
              {member.role === "owner" ? (
                <Badge variant="info">{t("owner")}</Badge>
              ) : owner || mine ? (
                <RemoveMember
                  sellerId={sellerId}
                  storeName={storeName}
                  member={member}
                  leaving={mine}
                />
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Removes a staff member, or the reader themself, after asking; a refusal stays in a toast. */
function RemoveMember({
  sellerId,
  storeName,
  member,
  leaving,
}: {
  sellerId: string;
  storeName: string;
  member: MemberBody;
  leaving: boolean;
}) {
  const t = useTranslations("StoreStaffPage");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const email = member.email;

  const confirm = async () => {
    setBusy(true);
    try {
      await removeSellerMember({ path: { sellerId, accountId: member.accountId } });
      setOpen(false);
      if (leaving) {
        toast.add({ type: "success", title: t("left", { store: storeName }) });
        router.replace("/stores");
        return;
      }
      toast.add({ type: "success", title: t("removed", { email }) });
      router.refresh();
    } catch (error) {
      const { detail, reference } = failureOf(error);
      toast.add({
        type: "error",
        title: t("failed"),
        description: [detail, reference && `(${reference})`].filter(Boolean).join(" ") || undefined,
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        {leaving ? (
          t("leave")
        ) : (
          <>
            {t("remove")}
            <span className="sr-only"> {email}</span>
          </>
        )}
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {leaving ? t("leaveTitle", { store: storeName }) : t("removeTitle", { email })}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t(leaving ? "leaveBody" : "removeBody")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction variant="destructive" disabled={busy} onClick={() => void confirm()}>
              {busy && <Spinner data-icon="inline-start" />}
              {t(leaving ? "leaveConfirm" : "removeConfirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
