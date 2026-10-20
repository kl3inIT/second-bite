"use client";

import { GlobeIcon, LogOutIcon, PanelLeftCloseIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Fragment, type ReactNode, useTransition } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sidebar, useSidebar } from "@/components/ui/sidebar";
import { Wordmark } from "@/components/wordmark";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { signOut } from "@/lib/api/generated";
import { cn } from "@/lib/utils";

import {
  adminHref,
  type AdminNamedPage,
  adminNavGroups,
  adminPages,
  isReleased,
  lineage,
  matchAdminPage,
  navItems,
} from "./pages";

type Account = { email: string; displayName: string };

/** The initials on the account's avatar: the name's first and last words, or the start of the address. */
function initialsOf({ email, displayName }: Account): string {
  const words = displayName.trim().split(/\s+/).filter(Boolean);
  const letters =
    words.length > 1 ? `${words[0][0]}${words.at(-1)?.[0]}` : (words[0] ?? email).slice(0, 2);
  return letters.toLocaleUpperCase();
}

/** Signs out on the server; the admin layout then reads no account and sends the page to sign in. */
function useSignOut() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return {
    pending,
    signOutHere: () =>
      startTransition(async () => {
        try {
          await signOut();
        } finally {
          router.refresh();
        }
      }),
  };
}

/** The sidebar item a page lights: the page itself, or the item of the page above it. */
function useOpenItem(): AdminNamedPage | undefined {
  const current = matchAdminPage(usePathname());
  if (!current) return undefined;
  return lineage(current).find((key): key is AdminNamedPage => "nav" in adminPages[key]);
}

const focusRing = "focus-visible:ring-3 focus-visible:ring-sidebar-ring focus-visible:outline-none";

// The admin's sidebar (SEC-62, Figma Admin/Sidebar 228:6027, AD-Q1 and AD-Q2), on shadcn's Sidebar. Open: the
// wordmark, its collapse button and the "Quản trị" tag, the fourteen items in their groups, then the language
// and the account at the foot over the light sweep. Collapsed: a 72px rail of icons labelled underneath, which
// the "sb" tile opens again. shadcn's cookie keeps the choice. On a phone it is a drawer, always open.
export function AdminSidebar({ account }: { account: Account }) {
  const t = useTranslations("admin.shell");
  const { state, isMobile } = useSidebar();
  const rail = state === "collapsed" && !isMobile;

  return (
    <Sidebar collapsible="icon" mobileTitle={t("sidebar.label")}>
      {rail ? <Rail account={account} /> : <Full account={account} />}
    </Sidebar>
  );
}

function Full({ account }: { account: Account }) {
  const t = useTranslations("admin.shell");
  const { toggleSidebar, isMobile, setOpenMobile } = useSidebar();
  const open = useOpenItem();
  // On a phone the drawer closes once an item is chosen.
  const closeDrawer = () => setOpenMobile(false);
  const { pending, signOutHere } = useSignOut();
  const toggleLabel = isMobile ? t("sidebar.close") : t("sidebar.collapse");

  return (
    <div className="relative flex h-full flex-col gap-5 overflow-hidden bg-sidebar px-4 pt-7 pb-6 text-sidebar-foreground">
      <Sweep />
      <div className="relative flex flex-col gap-1">
        <div className="flex items-center justify-between pl-1">
          <Link href={adminHref("overview")} className={cn("rounded-lg", focusRing)}>
            <Wordmark className="h-6" />
            <span className="sr-only">{t("sidebar.home")}</span>
          </Link>
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={toggleLabel}
            title={toggleLabel}
            className={cn(
              "flex size-11 items-center justify-center rounded-lg transition-colors hover:bg-sidebar-accent",
              focusRing,
            )}
          >
            <PanelLeftCloseIcon aria-hidden className="size-5" />
          </button>
        </div>
        <span className="ml-1 self-start rounded-full bg-fresh px-2.5 py-1 text-label-strong text-fresh-foreground">
          {t("title")}
        </span>
      </div>

      <nav
        aria-label={t("sidebar.label")}
        className="relative -mx-4 scrollbar-none flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4"
      >
        {adminNavGroups.map((group) => (
          <div key={group} className="flex flex-col gap-0.5">
            {(group === "operations" || group === "users" || group === "marketing") && (
              <h2 className="px-3 pt-1.5 pb-1 text-label-strong tracking-wide text-sidebar-muted-foreground uppercase">
                {t(`groups.${group}`)}
              </h2>
            )}
            <ul className="flex flex-col gap-0.5">
              {navItems(group).map((key) => {
                const Icon = adminPages[key].icon;
                const active = key === open;
                return (
                  <li key={key}>
                    <Link
                      href={adminHref(key)}
                      onClick={closeDrawer}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex h-11 items-center gap-3 rounded-xl pr-2.5 pl-3 text-body-sm-strong transition-colors",
                        focusRing,
                        active
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "hover:bg-sidebar-accent",
                      )}
                    >
                      <Icon aria-hidden className="size-5 shrink-0" />
                      <span className="min-w-0 flex-1 truncate">{t(`pages.${key}.label`)}</span>
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
          </div>
        ))}
      </nav>

      <div className="relative flex flex-col gap-5">
        <LanguageLink className="flex items-center gap-3 rounded-xl p-3 text-title hover:bg-sidebar-accent">
          <GlobeIcon aria-hidden className="size-5" />
        </LanguageLink>
        <div className="flex items-center gap-2.5 rounded-xl bg-sidebar-accent py-2.5 pr-2 pl-3 text-sidebar-accent-foreground">
          <Avatar account={account} />
          <span className="min-w-0 flex-1 truncate text-label-strong">{account.email}</span>
          <button
            type="button"
            onClick={signOutHere}
            disabled={pending}
            aria-label={t("sidebar.signOut")}
            title={t("sidebar.signOut")}
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-sidebar disabled:opacity-60",
              focusRing,
            )}
          >
            <LogOutIcon aria-hidden className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Rail({ account }: { account: Account }) {
  const t = useTranslations("admin.shell");
  const { toggleSidebar } = useSidebar();
  const open = useOpenItem();
  const { pending, signOutHere } = useSignOut();

  return (
    <div className="flex h-full flex-col items-center justify-between gap-4 bg-sidebar py-4 text-sidebar-foreground">
      <div className="flex min-h-0 w-full flex-col items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          title={t("sidebar.expand")}
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl bg-sidebar-accent text-title-lg text-sidebar-accent-foreground",
            focusRing,
          )}
        >
          {/* Named by the hidden words, not aria-label, so the "sb" on show is not taken for its name. */}
          <span aria-hidden>sb</span>
          <span className="sr-only">{t("sidebar.expand")}</span>
        </button>
        <nav
          aria-label={t("sidebar.label")}
          className="scrollbar-none min-h-0 w-full overflow-y-auto"
        >
          <ul className="flex flex-col items-center gap-1">
            {adminNavGroups.map((group, index) => (
              <Fragment key={group}>
                {index > 0 && group !== "bottom" && (
                  <li aria-hidden className="h-px w-10 shrink-0 bg-sidebar-border" />
                )}
                {navItems(group).map((key) => {
                  const Icon = adminPages[key].icon;
                  const active = key === open;
                  return (
                    <li key={key} className="w-full">
                      <Link
                        href={adminHref(key)}
                        aria-current={active ? "page" : undefined}
                        className="group/rail flex w-full flex-col items-center gap-0.5 py-1 focus-visible:outline-none"
                      >
                        <span
                          className={cn(
                            "flex h-7 w-11 items-center justify-center rounded-full transition-colors group-focus-visible/rail:ring-3 group-focus-visible/rail:ring-sidebar-ring",
                            active
                              ? "bg-sidebar-primary text-sidebar-primary-foreground"
                              : "group-hover/rail:bg-sidebar-accent",
                          )}
                        >
                          <Icon aria-hidden className="size-5" />
                        </span>
                        <span
                          className={cn(
                            "max-w-full truncate",
                            active
                              ? "text-label-strong"
                              : "text-label text-sidebar-muted-foreground group-hover/rail:text-sidebar-foreground",
                          )}
                        >
                          {t(`pages.${key}.short`)}
                        </span>
                        {/* The short label stands for the full name, which a screen reader reads too. */}
                        {t(`pages.${key}.short`) !== t(`pages.${key}.label`) && (
                          <span className="sr-only">{`, ${t(`pages.${key}.label`)}`}</span>
                        )}
                        {!isReleased(key) && <span className="sr-only">{`, ${t("soon")}`}</span>}
                      </Link>
                    </li>
                  );
                })}
              </Fragment>
            ))}
          </ul>
        </nav>
      </div>
      <div className="flex flex-col items-center gap-4">
        <LanguageLink className="flex flex-col items-center gap-1 rounded-xl px-1 pb-1 text-label text-sidebar-muted-foreground hover:text-sidebar-foreground">
          <span className="flex size-11 items-center justify-center rounded-xl text-sidebar-foreground">
            <GlobeIcon aria-hidden className="size-5" />
          </span>
        </LanguageLink>
        <DropdownMenu>
          <DropdownMenuTrigger variant="sidebar">
            <Avatar account={account} />
            <span className="sr-only">{t("sidebar.account", { email: account.email })}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end" className="min-w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>{account.email}</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem disabled={pending} onClick={signOutHere}>
                <LogOutIcon aria-hidden />
                {t("sidebar.signOut")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

/** The same page in the other language; it shows the current one, as Figma does ("Tiếng Việt"). */
function LanguageLink({ className, children }: { className: string; children: ReactNode }) {
  const t = useTranslations("admin.shell.sidebar");
  const pathname = usePathname();
  const other = useLocale() === "vi" ? "en" : "vi";

  return (
    <Link href={pathname} locale={other} className={cn("transition-colors", focusRing, className)}>
      {children}
      <span>{t("language")}</span>
      {/* Said in the language it switches to, as the customer header's switch does. */}
      <span lang={other} className="sr-only">{`, ${t("switchLanguage")}`}</span>
    </Link>
  );
}

function Avatar({ account }: { account: Account }) {
  return (
    <span
      aria-hidden
      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-fresh text-body-sm-strong text-fresh-foreground"
    >
      {initialsOf(account)}
    </span>
  );
}

// The light sweep at the sidebar's foot (Figma `sweep`, 228:5682): two waves, sky and deep blue, behind the
// language and the account. Decoration only.
function Sweep() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 256 300"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-75 w-full"
    >
      <path d="M0 120C70 70 170 60 256 0V300H0V120Z" className="fill-sky opacity-35" />
      <path
        d="M0 190C80 140 180 140 256 90V300H0V190Z"
        className="fill-sidebar-accent opacity-60"
      />
    </svg>
  );
}
