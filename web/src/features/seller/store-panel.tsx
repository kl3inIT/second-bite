import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * A panel of the seller's pages (Figma Q1, Q2, Q3): a section named by its heading (`labelledBy`), drawn as an
 * outlined card, its parts in a column.
 */
export function StorePanel({
  labelledBy,
  className,
  children,
}: {
  labelledBy: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={labelledBy}>
      <Card size="md">
        <CardContent>
          <div className={cn("flex flex-col gap-3", className)}>{children}</div>
        </CardContent>
      </Card>
    </section>
  );
}
