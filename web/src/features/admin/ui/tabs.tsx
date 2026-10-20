import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export type AdminTab = { key: string; label: string; href: string; count?: number };

/**
 * Tabs underlined in blue (Figma Admin/Tabs 238:42202, Admin/TabItem): "Tổng quan · Bài đăng 12 · Đơn hàng 48".
 * Each tab is an address (`?tab=posts`), so a tab can be shared and the back button returns to it; the open
 * one is `current`. `label` names the row for the screen reader.
 */
export function AdminTabs({
  label,
  tabs,
  current,
}: {
  label: string;
  tabs: AdminTab[];
  current: string;
}) {
  return (
    <nav aria-label={label} className="border-b border-border">
      <ul className="-mb-px scrollbar-none flex gap-6 overflow-x-auto">
        {tabs.map((tab) => {
          const open = tab.key === current;
          return (
            <li key={tab.key} className="shrink-0">
              <Link
                href={tab.href}
                scroll={false}
                aria-current={open ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-2 border-b-2 text-body-sm-strong transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                  open
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-label-strong text-muted-foreground">
                    {tab.count}
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
