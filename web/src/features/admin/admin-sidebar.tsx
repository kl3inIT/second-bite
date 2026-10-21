"use client";

import { ChevronsUpDownIcon, GlobeIcon, LogOutIcon, PanelLeftCloseIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useTransition } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Wordmark } from "@/components/wordmark";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { signOut } from "@/lib/api/generated";

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

// The admin's sidebar (SEC-62), shadcn's Sidebar as main has it: the wordmark and the "Quản trị" badge, the
// fourteen items in their groups, each with "Sắp có" while its page is not released, then the language and the
// account at the foot. The button in the top bar collapses it to the primitive's icon rail (`collapsible="icon"`),
// where each item names itself in a tooltip; shadcn's cookie keeps the choice. On a phone it is the primitive's
// drawer, closed from its own button and on a choice. The menu scrolls when it is taller than the window, and
// the open item is scrolled into view.
export function AdminSidebar({ account }: { account: Account }) {
  const t = useTranslations("admin.shell");
  const { isMobile, state, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed" && !isMobile;
  const open = useOpenItem();
  const content = useRef<HTMLDivElement>(null);
  const { pending, signOutHere } = useSignOut();
  // On a phone the drawer closes once an item is chosen.
  const closeDrawer = () => setOpenMobile(false);

  useEffect(() => {
    content.current
      ?.querySelector('[data-sidebar="menu-button"][data-active]')
      ?.scrollIntoView({ block: "nearest" });
  }, [open]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                tooltip={t("sidebar.home")}
                render={<Link href={adminHref("overview")} onClick={closeDrawer} />}
              >
                {/* The rail keeps the mark; the open sidebar shows the wordmark beside it. */}
                <Avatar>
                  <AvatarFallback>sb</AvatarFallback>
                </Avatar>
                <Wordmark className="h-6" />
                <span className="sr-only">{t("sidebar.home")}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={closeDrawer}
              aria-label={t("sidebar.close")}
            >
              <PanelLeftCloseIcon aria-hidden />
            </Button>
          )}
        </div>
        {!collapsed && (
          <div className="flex">
            <Badge variant="fresh">{t("title")}</Badge>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent ref={content}>
        <nav aria-label={t("sidebar.label")}>
          {adminNavGroups.map((group) => (
            <SidebarGroup key={group}>
              {(group === "operations" || group === "users" || group === "marketing") && (
                <SidebarGroupLabel>{t(`groups.${group}`)}</SidebarGroupLabel>
              )}
              <SidebarMenu>
                {navItems(group).map((key) => {
                  const Icon = adminPages[key].icon;
                  const active = key === open;
                  const label = t(`pages.${key}.label`);
                  return (
                    <SidebarMenuItem key={key}>
                      <SidebarMenuButton
                        isActive={active}
                        tooltip={isReleased(key) ? label : `${label} · ${t("soon")}`}
                        render={
                          <Link
                            href={adminHref(key)}
                            onClick={closeDrawer}
                            aria-current={active ? "page" : undefined}
                          />
                        }
                      >
                        <Icon aria-hidden />
                        {/* The name gives way before "Sắp có" does, so the mark never covers it. */}
                        <span className="min-w-0 flex-1 truncate">{label}</span>
                        {!isReleased(key) && <Badge variant="secondary">{t("soon")}</Badge>}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </nav>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <LanguageButton />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    tooltip={t("sidebar.account", { email: account.email })}
                  />
                }
              >
                <Avatar>
                  <AvatarFallback>{initialsOf(account)}</AvatarFallback>
                </Avatar>
                <span className="min-w-0 flex-1 truncate">{account.email}</span>
                <ChevronsUpDownIcon aria-hidden />
              </DropdownMenuTrigger>
              <DropdownMenuContent side={isMobile ? "top" : "right"} align="end">
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
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

/** The same page in the other language; it shows the current one, as Figma does ("Tiếng Việt"). */
function LanguageButton() {
  const t = useTranslations("admin.shell.sidebar");
  const pathname = usePathname();
  const other = useLocale() === "vi" ? "en" : "vi";

  return (
    <SidebarMenuButton tooltip={t("language")} render={<Link href={pathname} locale={other} />}>
      <GlobeIcon aria-hidden />
      <span>
        {t("language")}
        {/* Said in the language it switches to, as the customer header's switch does. */}
        <span lang={other} className="sr-only">{`, ${t("switchLanguage")}`}</span>
      </span>
    </SidebarMenuButton>
  );
}
