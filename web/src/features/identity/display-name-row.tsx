"use client";

import { PencilIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "@/i18n/navigation";
import { failureOf } from "@/lib/api/client";
import { setMyDisplayName } from "@/lib/api/generated";

/** As the server keeps it (server/internal/identity, maxDisplayNameLength). */
const MAX_LENGTH = 50;

/**
 * The display-name row of account settings (SEC-61): the name and "Sửa", then a field with "Lưu" and "Huỷ".
 * The server trims the name and says in its own words when it refuses one (SEC-28); the page reads the
 * account again after saving, so the header and the account tab show the new name.
 */
export function DisplayNameRow({ name }: { name: string }) {
  const t = useTranslations("AccountSettings");
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);
  const [problem, setProblem] = useState<string>();
  const [pending, startTransition] = useTransition();
  const field = useRef<HTMLInputElement>(null);

  // The field takes the focus the person gave "Sửa", so typing goes straight into it.
  useEffect(() => {
    if (editing) field.current?.focus();
  }, [editing]);

  function open() {
    setValue(name);
    setProblem(undefined);
    setEditing(true);
  }

  function save(event: React.FormEvent) {
    event.preventDefault();
    setProblem(undefined);
    startTransition(async () => {
      try {
        await setMyDisplayName({ body: { displayName: value } });
        setEditing(false);
        router.refresh();
      } catch (error) {
        setProblem(failureOf(error).detail ?? t("nameFailed"));
      }
    });
  }

  if (!editing) {
    return (
      <div className="flex min-h-12 items-center justify-between gap-4 px-3 py-2">
        <dt className="shrink-0 text-body-sm">{t("displayName")}</dt>
        <dd className="flex min-w-0 items-center gap-1">
          <span className="truncate text-body-sm text-muted-foreground">
            {name || t("noDisplayName")}
          </span>
          <Button variant="ghost" size="sm" onClick={open} aria-label={t("editName")}>
            <PencilIcon data-icon="inline-start" />
            {t("edit")}
          </Button>
        </dd>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 px-3 py-3">
      <dt>
        <label htmlFor="display-name" className="text-body-sm">
          {t("displayName")}
        </label>
      </dt>
      <dd>
        <form onSubmit={save} className="flex flex-col gap-2" noValidate>
          <Input
            id="display-name"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            maxLength={MAX_LENGTH}
            autoComplete="name"
            ref={field}
            aria-invalid={problem ? true : undefined}
            aria-describedby={problem ? "display-name-problem" : undefined}
            disabled={pending}
          />
          {problem && <FieldError id="display-name-problem">{problem}</FieldError>}
          <div className="flex gap-2">
            <Button type="submit" disabled={pending}>
              {pending && <Spinner data-icon="inline-start" />}
              {pending ? t("saving") : t("save")}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => setEditing(false)}
            >
              {t("cancel")}
            </Button>
          </div>
        </form>
      </dd>
    </div>
  );
}
