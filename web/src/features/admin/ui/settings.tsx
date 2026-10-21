"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { adminHref, isReleased, settingsPages } from "../pages";
import { PageHeader } from "./page-header";

/**
 * A settings page (Figma AD-CS1): "Cài đặt" over the settings menu on the left and the page's own title and
 * cards on the right. `title` is the open page's name ("Bài đăng"); `actions` sit on its right ("Thêm danh mục"),
 * under it on a phone. On a phone the menu sits above.
 */
export function SettingsLayout({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const t = useTranslations("admin.shell");
  return (
    <>
      <PageHeader title={t("pages.settings.label")} />
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-4">
        <SettingsNav />
        <section aria-labelledby="settings-title" className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="settings-title" className="text-card-title text-foreground">
              {title}
            </h2>
            {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
          </div>
          {children}
        </section>
      </div>
    </>
  );
}

/**
 * The eight settings pages in a white card (Figma Admin/SettingsNav 238:59533), the open one on the sky wash in
 * blue. Its items come from the page registry, with "Sắp có" on a page that is not open.
 */
export function SettingsNav() {
  const t = useTranslations("admin.shell");
  const pathname = usePathname();

  return (
    <nav
      aria-label={t("settingsNav")}
      className="shrink-0 rounded-2xl border border-border bg-card p-1.5 lg:w-60"
    >
      <ul className="flex flex-col gap-0.5">
        {settingsPages.map((key) => {
          const href = adminHref(key);
          const open = pathname === href;
          return (
            <li key={key}>
              <Link
                href={href}
                aria-current={open ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-2 rounded-xl px-3 text-body-sm transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                  open
                    ? "bg-secondary text-body-sm-strong text-primary"
                    : "text-foreground hover:bg-muted",
                )}
              >
                <span className="min-w-0 flex-1 truncate">{t(`pages.${key}.label`)}</span>
                {/* As in the sidebar. */}
                {!isReleased(key) && (
                  <span className="shrink-0 rounded-full bg-fresh px-2 py-0.5 text-label-strong text-fresh-foreground">
                    {t("soon")}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** A group of settings in a white card with its title and no description (Figma Admin/SettingsCard 238:59690). */
export function SettingsCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
      <h3 className="text-title text-foreground">{title}</h3>
      {children}
    </section>
  );
}

/**
 * The foot of a settings form (Figma Admin/FormFooter 243:60723): a status on the left (when it was last saved,
 * "Bạn có thay đổi chưa lưu" in amber once changed, "Đang lưu thay đổi…" while saving), Huỷ and Lưu thay đổi on
 * the right. Nothing to save, nothing can be pressed; while saving, only the spinner moves. Put it inside the
 * <form>; Lưu submits it and Huỷ calls `onCancel`, which puts the saved values back.
 */
export function FormFooter({
  dirty,
  saving,
  savedStatus,
  onCancel,
}: {
  dirty: boolean;
  saving: boolean;
  /** "Cập nhật lần cuối lúc 09:30, 20/10/2026", or nothing. */
  savedStatus?: string;
  onCancel: () => void;
}) {
  const t = useTranslations("admin.shell.form");
  const status = saving ? t("saving") : dirty ? t("dirty") : savedStatus;

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card py-4 pr-4 pl-6">
      <output
        className={cn(
          "min-w-0 flex-1",
          dirty && !saving
            ? "text-label-strong text-warning-foreground"
            : "text-label text-muted-foreground",
        )}
      >
        {status}
      </output>
      <Button variant="outline" type="button" disabled={!dirty || saving} onClick={onCancel}>
        {t("cancel")}
      </Button>
      <Button type="submit" disabled={!dirty || saving}>
        {saving ? <Spinner data-icon="inline-start" /> : null}
        {saving ? t("savingButton") : t("save")}
      </Button>
    </div>
  );
}
