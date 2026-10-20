import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-label-strong whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline: "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
        // Second Bite (DESIGN.md › Sticker, One Discount Rule): stock on a photograph, sold out, and the
        // one discount chip, whose figure is set in Bricolage.
        fresh: "h-auto bg-fresh px-2.5 py-1 text-fresh-foreground",
        soldOut: "h-auto bg-muted-foreground px-2.5 py-1 text-card",
        discount: "bg-fresh font-display text-figure-sm text-fresh-foreground",
        // Second Bite (Figma Admin/Badge 228:21264, Admin/StatusBadge 228:5238): the admin's tones, each with
        // its icon and words, never colour alone.
        success: "h-auto gap-1.5 bg-fresh-muted py-1 pr-3 pl-2.5 text-success [&>svg]:size-3.5!",
        warning:
          "h-auto gap-1.5 bg-warning py-1 pr-3 pl-2.5 text-warning-foreground [&>svg]:size-3.5!",
        error:
          "h-auto gap-1.5 bg-destructive-muted py-1 pr-3 pl-2.5 text-destructive [&>svg]:size-3.5!",
        info: "h-auto gap-1.5 bg-secondary py-1 pr-3 pl-2.5 text-primary [&>svg]:size-3.5!",
        neutral:
          "h-auto gap-1.5 border-border bg-muted py-1 pr-3 pl-2.5 text-muted-foreground [&>svg]:size-3.5!",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge, badgeVariants };
