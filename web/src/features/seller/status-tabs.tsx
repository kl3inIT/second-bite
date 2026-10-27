import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type StatusTab = {
  name: string;
  href: string;
  /** The tab's visible name. */
  label: string;
  count: number;
};

/**
 * The status tabs of a seller's panel: one equal-width pill per status, its name over its count, the selected one
 * filled. A screen reader hears the name, a dot and the count ("Chuẩn bị · 3"), which holds the visible words.
 * `nameOnly` draws each as a chip with its name alone (the home's orders card); the count is still read.
 */
export function StatusTabs({
  label,
  tabs,
  selected,
  scroll,
  nameOnly = false,
}: {
  label: string;
  tabs: StatusTab[];
  selected: string;
  scroll?: boolean;
  nameOnly?: boolean;
}) {
  if (nameOnly) {
    // Drawn as the Chip of the dish form (Figma Q3c "Loại"): a 38 px pill as wide as its name, in a 44 px target.
    // The row stays one line; where a small phone cannot hold it, it scrolls sideways out to the card's edges (its
    // 20 px padding), so the pill cut at the edge says there is more. The 4 px above and below keep the focus ring.
    return (
      <nav aria-label={label}>
        <ul className="-mx-5 -my-1 scrollbar-none flex gap-2 overflow-x-auto overflow-y-hidden px-5 py-1">
          {tabs.map((tab) => (
            <li key={tab.name} className="shrink-0">
              <Link
                href={tab.href}
                scroll={scroll}
                aria-current={tab.name === selected ? "page" : undefined}
                className="group/chip flex min-h-11 items-center rounded-full focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
              >
                <span
                  className={cn(
                    "flex h-9.5 items-center rounded-full border px-4 whitespace-nowrap transition-colors",
                    tab.name === selected
                      ? "border-primary bg-primary text-body-sm-strong text-primary-foreground"
                      : "border-border bg-card text-body-sm text-foreground group-hover/chip:bg-secondary",
                  )}
                >
                  {tab.label}
                  <span className="sr-only">{` · ${tab.count}`}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <nav aria-label={label}>
      <ul className="flex gap-1.5">
        {tabs.map((tab) => (
          <li key={tab.name} className="min-w-0 flex-1">
            <Link
              href={tab.href}
              scroll={scroll}
              aria-current={tab.name === selected ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center rounded-2xl border px-1 py-2 text-center whitespace-nowrap transition-colors focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none",
                tab.name === selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:bg-secondary",
              )}
            >
              <span className="text-label-strong">{tab.label}</span>
              <span className="sr-only"> · </span>
              <span className="text-body-sm-strong">{tab.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
