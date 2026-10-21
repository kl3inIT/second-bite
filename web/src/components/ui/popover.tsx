"use client";

import * as React from "react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { chipTrigger } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Second Bite: "field" is a trigger drawn as an input (Figma Q5, the day of the order list): 44px, an edge, the
// value in `title-lg` after its icon.
const fieldTrigger =
  "data-[variant=field]:flex data-[variant=field]:h-11 data-[variant=field]:shrink-0 data-[variant=field]:items-center data-[variant=field]:gap-2.5 data-[variant=field]:rounded-xl data-[variant=field]:border data-[variant=field]:border-input data-[variant=field]:bg-card data-[variant=field]:px-3.5 data-[variant=field]:text-title-lg data-[variant=field]:whitespace-nowrap data-[variant=field]:transition-colors data-[variant=field]:hover:bg-secondary data-[variant=field]:focus-visible:ring-3 data-[variant=field]:focus-visible:ring-ring/50 data-[variant=field]:focus-visible:outline-none";

function Popover({ ...props }: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

// Second Bite: "chip" is the search's filter chip, as DropdownMenuTrigger's, for a filter that opens a form
// rather than a list (Figma K2 chip lọc); `raised` sits it on the sky ground itself (Figma K1b).
function PopoverTrigger({
  className,
  variant = "plain",
  raised = false,
  ...props
}: PopoverPrimitive.Trigger.Props & { variant?: "plain" | "chip" | "field"; raised?: boolean }) {
  return (
    <PopoverPrimitive.Trigger
      data-slot="popover-trigger"
      data-variant={variant}
      data-raised={raised ? "" : undefined}
      className={cn(chipTrigger, fieldTrigger, className)}
      {...props}
    />
  );
}

function PopoverContent({
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  sheet = false,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<PopoverPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset"> & {
    // Second Bite: "sheet" makes the popover a sheet from the bottom, over a scrim, below 640px (Figma Q5g, mobile).
    sheet?: boolean;
  }) {
  return (
    <PopoverPrimitive.Portal>
      {sheet && <div aria-hidden className="fixed inset-0 z-40 bg-black/10 sm:hidden" />}
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className={cn(
          "isolate z-50",
          sheet &&
            "max-sm:fixed! max-sm:inset-x-0! max-sm:top-auto! max-sm:bottom-0! max-sm:transform-none!",
        )}
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn(
            "z-50 flex w-72 origin-(--transform-origin) flex-col gap-2.5 rounded-lg bg-popover p-2.5 text-body-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            sheet &&
              "max-sm:w-full max-sm:rounded-t-3xl max-sm:rounded-b-none max-sm:p-4 max-sm:pb-8",
            className,
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-0.5 text-body-sm", className)}
      {...props}
    />
  );
}

function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props) {
  return (
    // Second Bite: a panel's title, as a sheet's.
    <PopoverPrimitive.Title
      data-slot="popover-title"
      className={cn("text-body-sm-strong text-foreground", className)}
      {...props}
    />
  );
}

function PopoverDescription({ className, ...props }: PopoverPrimitive.Description.Props) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
}

export { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger };
