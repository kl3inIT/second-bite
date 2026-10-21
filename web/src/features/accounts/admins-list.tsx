"use client";

import { revalidateLogic, useForm } from "@tanstack/react-form";
import { CircleAlertIcon, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { z } from "zod";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { DataTable, type DataTableColumns } from "@/features/admin/data-table";
import { Link, useRouter } from "@/i18n/navigation";
import { ApiError, failureOf } from "@/lib/api/client";
import { grantAdmin, revokeAdmin, type RecordBody } from "@/lib/api/generated";

import { AccountAvatar, nameOf, SignedIn } from "./account-parts";

/**
 * Who administers Second Bite (Settings › Quản trị viên, SEC-75): every admin with their last sign-in, a
 * dialog that makes an address an admin, and a revoke that asks first. An admin cannot revoke themselves
 * nor the last admin; the row says why instead of hiding the button.
 */
export function AdminsList({ admins, myId }: { admins: RecordBody[]; myId: string }) {
  const t = useTranslations("Admin.admins");
  const columns = useColumns(admins.length, myId);

  return (
    <section aria-labelledby="admins-title" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 id="admins-title" className="text-card-title text-foreground">
            {t("title")}
          </h2>
          <p className="text-body-sm text-muted-foreground">{t("description")}</p>
        </div>
        <GrantAdmin />
      </div>
      <DataTable
        label={t("title")}
        columns={columns}
        rows={admins}
        rowKey={(admin) => admin.id}
        empty={null}
      />
    </section>
  );
}

function useColumns(count: number, myId: string): DataTableColumns<RecordBody> {
  const t = useTranslations("Admin.admins");

  return [
    {
      id: "account",
      header: t("column.account"),
      cell: ({ row }) => (
        <div className="flex min-w-48 items-center gap-3">
          <AccountAvatar account={row.original} />
          <div className="flex min-w-0 flex-col">
            <span className="flex items-center gap-2">
              <Link
                href={`/admin/accounts/${row.original.id}`}
                className="truncate text-body-sm-strong text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                {nameOf(row.original)}
              </Link>
              {row.original.id === myId && <Badge variant="info">{t("you")}</Badge>}
            </span>
            {row.original.displayName && (
              <span className="truncate text-label text-muted-foreground">
                {row.original.email}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "signedIn",
      header: t("column.signedIn"),
      cell: ({ row }) => <SignedIn at={row.original.lastSignedInAt} />,
    },
    {
      id: "actions",
      header: () => <span className="sr-only">{t("column.actions")}</span>,
      cell: ({ row }) => {
        const blocked =
          row.original.id === myId ? t("revoke.self") : count <= 1 ? t("revoke.last") : null;
        return blocked ? (
          <span className="text-label text-muted-foreground">{blocked}</span>
        ) : (
          <RevokeAdmin admin={row.original} />
        );
      },
    },
  ];
}

function GrantAdmin() {
  const t = useTranslations("Admin.admins.grant");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [refusal, setRefusal] = useState<{ detail?: string; reference?: string }>();

  const form = useForm({
    defaultValues: { email: "" },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: z.object({
        email: z
          .string()
          .trim()
          .pipe(z.email({ message: t("invalid") })),
      }),
    },
    onSubmitInvalid: () => document.getElementById("grant-email")?.focus(),
    onSubmit: async ({ value }) => {
      setRefusal(undefined);
      const email = value.email.trim();
      try {
        await grantAdmin({ body: { email } });
      } catch (error) {
        if (error instanceof ApiError && error.code === "IDENTITY_EMAIL_INVALID") {
          form.setFieldMeta("email", (meta) => ({
            ...meta,
            errorMap: { ...meta.errorMap, onServer: { message: error.detail ?? t("invalid") } },
          }));
          document.getElementById("grant-email")?.focus();
          return;
        }
        setRefusal(failureOf(error));
        return;
      }
      toast.add({ type: "success", title: t("done", { email }) });
      setOpen(false);
      form.reset();
      router.refresh();
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          form.reset();
          setRefusal(undefined);
        }
      }}
    >
      <DialogTrigger render={<Button />}>
        <PlusIcon data-icon="inline-start" aria-hidden />
        {t("open")}
      </DialogTrigger>
      <DialogContent>
        <form
          noValidate
          className="flex flex-col gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
          </DialogHeader>
          <form.Field name="email">
            {(field) => {
              const invalid = !field.state.meta.isValid;
              return (
                <Field data-invalid={invalid || undefined}>
                  <FieldLabel htmlFor="grant-email">{t("email")}</FieldLabel>
                  <Input
                    id="grant-email"
                    name="email"
                    type="email"
                    autoComplete="off"
                    inputMode="email"
                    placeholder="ten@gmail.com"
                    value={field.state.value}
                    aria-invalid={invalid || undefined}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              );
            }}
          </form.Field>
          {refusal && (
            <Alert variant="destructive">
              <CircleAlertIcon aria-hidden />
              <AlertTitle>{t("failed")}</AlertTitle>
              <AlertDescription>
                {refusal.detail ?? t("unreachable")}
                {refusal.reference && ` (${refusal.reference})`}
              </AlertDescription>
            </Alert>
          )}
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(submitting) => (
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  {t("cancel")}
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Spinner data-icon="inline-start" />}
                  {t("submit")}
                </Button>
              </DialogFooter>
            )}
          </form.Subscribe>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function RevokeAdmin({ admin }: { admin: RecordBody }) {
  const t = useTranslations("Admin.admins.revoke");
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const name = nameOf(admin);

  const revoke = async () => {
    setBusy(true);
    try {
      await revokeAdmin({ path: { accountId: admin.id } });
      toast.add({ type: "success", title: t("done", { name }) });
      router.refresh();
    } catch (error) {
      const { detail, reference } = failureOf(error);
      toast.add({
        type: "error",
        title: t("failed", { name }),
        description: [detail ?? t("unreachable"), reference && `(${reference})`]
          .filter(Boolean)
          .join(" "),
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline" />}>
        {t("open")}
        <span className="sr-only"> {name}</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title", { name })}</AlertDialogTitle>
          <AlertDialogDescription>{t("description")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={busy} onClick={() => void revoke()}>
            {busy && <Spinner data-icon="inline-start" />}
            {t("confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
