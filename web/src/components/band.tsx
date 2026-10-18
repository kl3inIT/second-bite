import { cva, type VariantProps } from "class-variance-authority";

// The stock chip on an offer card (DESIGN.md › Components › Band): window and stock, always as text.
const bandVariants = cva("inline-flex self-start rounded-full px-2.5 py-1 text-body-sm-strong", {
  variants: {
    state: {
      available: "bg-signature text-signature-foreground",
      soldOut: "bg-muted text-muted-foreground",
      expected: "border border-dashed border-link bg-card text-link",
    },
  },
});

export type BandState = NonNullable<VariantProps<typeof bandVariants>["state"]>;

export function Band({ state, children }: { state: BandState; children: React.ReactNode }) {
  return <span className={bandVariants({ state })}>{children}</span>;
}
