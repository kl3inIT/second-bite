import type { ReactNode } from "react";

// A page's heading (Figma Admin/PageHeader 228:6038): its name, with no line under it, and on the right what
// acts on the whole page, such as Tổng quan's range or Báo cáo's export.
export function PageHeader({ title, actions }: { title: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-page-title text-foreground">{title}</h1>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
}
