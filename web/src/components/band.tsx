import { cva, type VariantProps } from "class-variance-authority";

// The rubber band on an offer card (DESIGN.md › Components › Band): window and stock, always as text.
const bandVariants = cva("inline-flex self-start rounded-sm px-3 py-1 text-body-sm-strong", {
  variants: {
    state: {
      available: "bg-signature text-signature-foreground shadow-band",
      soldOut: "bg-muted-foreground text-card",
      expected: "border border-dashed border-signature bg-card text-signature",
    },
  },
});

export type BandState = NonNullable<VariantProps<typeof bandVariants>["state"]>;

export function Band({ state, children }: { state: BandState; children: React.ReactNode }) {
  return <span className={bandVariants({ state })}>{children}</span>;
}
