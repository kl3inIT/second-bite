"use client";

import type { ReactNode } from "react";

import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";

/**
 * A panel that slides in from the right over the page (Figma Admin/Sheet 238:53305, AD-QD3): 480px, its title
 * and close at the top over a hairline, its body scrolling, and `footer` (Huỷ, Lưu) at the foot over a hairline.
 * A post opened from a store's page shows here without leaving the page (docs: admin-web-flow). The page owns
 * `open`; on a phone the panel takes the whole width.
 */
export function SideSheet({
  open,
  onOpenChange,
  title,
  footer,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader variant="bar">
          <SheetTitle variant="headline">{title}</SheetTitle>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
          {children}
        </div>
        {footer && <SheetFooter variant="bar">{footer}</SheetFooter>}
      </SheetContent>
    </Sheet>
  );
}
