import { InboxIcon, type LucideIcon } from "lucide-react";

// What a list or a card shows with nothing in it (Figma Admin/EmptyState 238:49517): an icon in a pale circle
// and one line, "Chưa có dữ liệu"; no description and no action (docs: admin-web-flow › Tab rỗng). A page
// whose backend does not exist yet shows it, never invented rows.
export function EmptyState({
  title,
  icon: Icon = InboxIcon,
}: {
  title: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-8 py-10 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-secondary text-primary">
        <Icon aria-hidden className="size-7" />
      </span>
      <p className="text-title text-foreground">{title}</p>
    </div>
  );
}
