"use client";

import { GlobeIcon, LogOutIcon, PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { Wordmark } from "@/components/wordmark";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { signOut } from "@/lib/api/generated";

import { adminNav, isWithin } from "./nav";

// The admin's sidebar (Figma Admin/Sidebar, 228:6027): the wordmark with the collapse button and the
// "Quản trị" tag, the menu by group, then the language and the account at the foot, over the light sweep.
// Collapsed, it keeps the icons, each named in a tooltip.
export function AdminSidebar({ email }: { email: string }) {
  const t = useTranslations("Admin");
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" label={t("menu")}>
      <SidebarSweep />
      <SidebarHeader>
        <div className="flex h-11 items-center justify-between gap-2 ps-1 group-data-[collapsible=icon]:ps-0">
          <Link
            href="/admin"
            className="rounded-sm text-sidebar-foreground outline-hidden group-data-[collapsible=icon]:hidden focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          >
            <Wordmark />
            <span className="sr-only">{t("home")}</span>
          </Link>
          <CollapseButton />
        </div>
        <Badge variant="fresh" className="ms-1 self-start group-data-[collapsible=icon]:hidden">
          {t("tag")}
        </Badge>
      </SidebarHeader>
      <SidebarContent>
        {adminNav.map((group, index) => (
          <SidebarGroup key={group.key ?? index}>
            {group.key && <SidebarGroupLabel>{t(`group.${group.key}`)}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map(({ key, href, icon: Icon }) => {
                  const active = isWithin(pathname, href);
                  return (
                    <SidebarMenuItem key={key}>
                      <SidebarMenuButton
                        size="nav"
                        isActive={active}
                        tooltip={t(`nav.${key}`)}
                        render={<Link href={href} aria-current={active ? "page" : undefined} />}
                      >
                        <Icon aria-hidden />
                        <span>{t(`nav.${key}`)}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <LanguageButton />
          </SidebarMenuItem>
        </SidebarMenu>
        <AccountCard email={email} />
      </SidebarFooter>
    </Sidebar>
  );
}

function CollapseButton() {
  const t = useTranslations("Admin");
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const Icon = collapsed ? PanelLeftOpenIcon : PanelLeftCloseIcon;

  return (
    <Button
      size="icon"
      onClick={toggleSidebar}
      aria-label={collapsed ? t("expand") : t("collapse")}
      aria-expanded={!collapsed}
      variant="sidebar"
      className="max-md:hidden"
    >
      <Icon aria-hidden />
    </Button>
  );
}

// The other language, opening the same page; next-intl's cookie keeps the choice.
function LanguageButton() {
  const t = useTranslations("Admin");
  const pathname = usePathname();
  const other = useLocale() === "vi" ? "en" : "vi";

  return (
    <SidebarMenuButton
      size="nav"
      tooltip={t("language")}
      render={<Link href={pathname} locale={other} lang={other} />}
    >
      <GlobeIcon aria-hidden />
      <span>{t("language")}</span>
    </SidebarMenuButton>
  );
}

// Who is signed in and the way out, on the deeper blue (Figma account, 228:5732).
function AccountCard({ email }: { email: string }) {
  const t = useTranslations("Admin");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2.5 rounded-md bg-sidebar-raised py-2.5 ps-3 pe-2 text-sidebar-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0">
      <Avatar className="size-9">
        <AvatarFallback tone="fresh">{email.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <span className="min-w-0 flex-1 truncate text-label-strong group-data-[collapsible=icon]:hidden">
        {email}
      </span>
      <Button
        size="icon"
        disabled={pending}
        aria-label={t("signOut")}
        variant="sidebar"
        className="group-data-[collapsible=icon]:hidden"
        onClick={() =>
          startTransition(async () => {
            try {
              await signOut();
            } finally {
              router.replace("/");
            }
          })
        }
      >
        {pending ? <Spinner aria-hidden /> : <LogOutIcon aria-hidden />}
      </Button>
    </div>
  );
}

// The light sweep at the sidebar's foot (Figma sweep, 228:5682): Tasco sky at 35% and the deep blue at 60%
// over the sidebar's own blue. Decoration only.
function SidebarSweep() {
  return (
    <svg
      viewBox="0 0 256 300"
      preserveAspectRatio="none"
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 h-75 w-full"
    >
      <path d="M0 120C70 70 170 60 256 0V300H0V120Z" className="fill-sky opacity-35" />
      <path
        d="M0 190C80 140 180 140 256 90V300H0V190Z"
        className="fill-sidebar-raised opacity-60"
      />
    </svg>
  );
}
