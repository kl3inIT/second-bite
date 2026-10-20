import { CheckIcon, ChevronDownIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/i18n/navigation";

export type FilterOption = {
  label: string;
  /** The search's query once this option is chosen. */
  query: Record<string, string>;
  current: boolean;
};

// One filter of the search (Figma K2 chip lọc) or its order ("Gần nhất ▾"): a chip or a short link that
// opens its options, each a link over the address, so a filtered search can be shared and works with the
// back button. The trigger shows the chosen option once there is one.
export function FilterMenu({
  name,
  options,
  variant,
}: {
  /** What the menu filters by, shown until an option other than the first is chosen. */
  name: string;
  /** The first option is the one without a filter. */
  options: readonly FilterOption[];
  variant: "chip" | "inline";
}) {
  const chosen = options.slice(1).find((option) => option.current);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        variant={variant}
        data-active={chosen ? "" : undefined}
        // A chip showing its choice still says what it filters by.
        aria-label={chosen ? `${name}: ${chosen.label}` : undefined}
      >
        {chosen?.label ?? name}
        <ChevronDownIcon aria-hidden className="size-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((option) => (
          <DropdownMenuItem
            key={option.label}
            render={<Link href={{ pathname: "/search", query: option.query }} />}
          >
            <span className="flex-1">{option.label}</span>
            {option.current && <CheckIcon aria-hidden className="text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
