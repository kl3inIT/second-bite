import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding text-button whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Second Bite: a solid action darkens under the pointer (primary-hover keeps 10:1), never fades.
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        // Second Bite: a deep-leaf outline on a white card.
        outline:
          "border-primary bg-card text-primary hover:bg-secondary aria-expanded:bg-secondary",
        // Second Bite: Figma Button/Secondary, leaf wash with deep-leaf text, darker wash under the pointer.
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary-hover aria-expanded:bg-secondary-hover aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
        // Second Bite: an icon or text action on the white top bar.
        shell: "text-shell-foreground hover:bg-muted",
        // Second Bite (Figma K2a): a suggestion chip on the sky ground, without an edge.
        chip: "bg-muted text-foreground hover:bg-secondary aria-pressed:bg-secondary aria-pressed:text-body-sm-strong aria-pressed:text-primary",
      },
      size: {
        // Second Bite: 44px targets for one-handed use (PRODUCT.md › Accessibility).
        default:
          "h-11 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        // Second Bite: Figma Button/Primary and Button/Secondary, 52px high, fully rounded, 24px sides.
        lg: "h-13 gap-2 px-6 has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
        // Second Bite: a text action inside a sentence ("Đổi email", "Gửi lại mã"), sized by the line it sits in.
        inline: "h-auto p-0 text-body-sm-strong",
        icon: "size-11",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-12",
        // Second Bite: a 34px chip with a 44px target around it.
        chip: "relative h-8.5 px-3.5 text-body-sm after:absolute after:inset-x-0 after:-inset-y-1.25",
        // Second Bite: a quick choice in a small panel, 28px with 12px text, still a 44px target.
        "chip-sm":
          "relative h-7 px-3 text-label after:absolute after:inset-x-0 after:-inset-y-2 aria-pressed:text-label-strong",
        // Second Bite: a 36px button in a small panel, still a 44px target.
        panel:
          "relative h-9 gap-1.5 px-4 text-body-sm-strong after:absolute after:inset-x-0 after:-inset-y-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

// Second Bite (Figma K2 chip lọc): the filter chip on a trigger, a menu's or a panel's, set by
// `data-variant="chip"`: fully rounded on the sky fill without an edge, its value shown once chosen
// (`data-active`), a 44px target around its 34px; `data-raised` sets it on the sky ground itself (Figma K1b).
const chipTrigger = cn(
  "data-[variant=chip]:relative data-[variant=chip]:flex data-[variant=chip]:h-8.5 data-[variant=chip]:shrink-0 data-[variant=chip]:items-center data-[variant=chip]:gap-1.5 data-[variant=chip]:rounded-full data-[variant=chip]:bg-muted data-[variant=chip]:px-3.5 data-[variant=chip]:text-body-sm data-[variant=chip]:whitespace-nowrap data-[variant=chip]:text-foreground data-[variant=chip]:transition-colors data-[variant=chip]:after:absolute data-[variant=chip]:after:inset-x-0 data-[variant=chip]:after:-inset-y-1.25 data-[variant=chip]:hover:bg-secondary data-[variant=chip]:focus-visible:ring-3 data-[variant=chip]:focus-visible:ring-ring/50 data-[variant=chip]:focus-visible:outline-none data-[variant=chip]:data-active:bg-secondary data-[variant=chip]:data-active:text-body-sm-strong data-[variant=chip]:data-active:text-primary",
  "data-raised:data-[variant=chip]:bg-card data-raised:data-[variant=chip]:ring-1 data-raised:data-[variant=chip]:ring-secondary data-raised:data-[variant=chip]:ring-inset data-raised:data-[variant=chip]:hover:bg-secondary data-raised:data-[variant=chip]:data-active:bg-secondary",
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants, chipTrigger };
