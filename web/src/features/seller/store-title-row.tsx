import { cn } from "@/lib/utils";

// The first line of a store tab (Figma Q1, Q2, Q3, Q5): the page's name, and what goes with it (its main button,
// a summary). On a phone it sits in the blue of the header, white, in the room the layout keeps for it, with the
// pale sheet starting below. `phoneTitle` is the tab's name where the page's own title is the store's name.
export function StoreTitleRow({
  title,
  phoneTitle,
  aside,
  baseline,
}: {
  title: string;
  phoneTitle?: string;
  aside?: React.ReactNode;
  baseline?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex min-h-13 justify-between gap-4 max-md:mb-8",
        baseline ? "items-baseline max-md:items-center" : "items-center",
      )}
    >
      <h1 className="text-page-title text-foreground max-md:text-header-foreground">
        {phoneTitle ? (
          <>
            <span className="max-md:hidden">{title}</span>
            <span className="md:hidden">{phoneTitle}</span>
          </>
        ) : (
          title
        )}
      </h1>
      {aside}
    </div>
  );
}

/** The class of a title row's main button on a phone: the pale button on the blue (Figma Button `secondary`). */
export const titleActionPhone =
  "max-md:bg-secondary max-md:text-secondary-foreground max-md:hover:bg-secondary-hover";
