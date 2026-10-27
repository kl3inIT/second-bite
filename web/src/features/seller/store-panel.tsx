import { Panel } from "@/components/panel";

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
    <Panel size="md" aria-labelledby={labelledBy} contentClassName={className}>
      {children}
    </Panel>
  );
}
