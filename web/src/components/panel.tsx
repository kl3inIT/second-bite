import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * A panel of a page: an outlined card whose parts stand in a column, inside the element that names it (a
 * `section` named by its heading, an `article`). `size` is the card's: `md` for the seller's pages, `page` for a
 * page of text. `className` places the panel; `contentClassName` spaces its column.
 */
export function Panel({
  as: Element = "section",
  size = "page",
  className,
  contentClassName,
  children,
  ...props
}: {
  as?: "section" | "article" | "div";
  size?: "md" | "page";
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
} & Pick<React.ComponentProps<"section">, "aria-label" | "aria-labelledby" | "id">) {
  return (
    <Element className={className} {...props}>
      <Card size={size}>
        <CardContent>
          <div className={cn("flex flex-col gap-3", contentClassName)}>{children}</div>
        </CardContent>
      </Card>
    </Element>
  );
}
