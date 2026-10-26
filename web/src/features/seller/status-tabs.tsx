import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type StatusTab = {
  name: string;
  href: string;
  /** The tab's visible name. */
  label: string;
  /** The tab's name with its count, read by assistive technology. */
  accessibleLabel: string;
  count: number;
};

/**
 * The status tabs of a seller's panel: one equal-width pill per status, its name over its count, the selected one
 * filled.
 */
export function StatusTabs({
  label,
  tabs,
  selected,
  scroll,
}: {
  label: string;
  tabs: StatusTab[];
  selected: string;
  scroll?: boolean;
}) {
  return (
    <nav aria-label={label}>
      <ul className="flex gap-1.5">
        {tabs.map((tab) => (
          <li key={tab.name} className="min-w-0 flex-1">
            <Link
              href={tab.href}
              scroll={scroll}
              aria-label={tab.accessibleLabel}
              aria-current={tab.name === selected ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center rounded-2xl border px-1 py-2 text-center whitespace-nowrap transition-colors focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none",
                tab.name === selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:bg-secondary",
              )}
            >
              <span className="text-label-strong">{tab.label}</span>
              <span className="text-body-sm-strong">{tab.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
