import { cn } from "@/lib/utils";

// The row of buttons that ends a form (Figma "Thêm món", "Sửa món", "Mở quán"): on a phone it is fixed at the
// foot of the screen over a hairline, its buttons of equal width, as the app does; from `md` it is a plain row
// as the page lays it. The page keeps room under its card for the bar.
export function PhoneFootBar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "max-md:fixed max-md:inset-x-0 max-md:bottom-0 max-md:z-30 max-md:flex max-md:gap-2 max-md:border-t max-md:border-border max-md:bg-card max-md:px-4 max-md:pt-3 max-md:pb-6 max-md:*:flex-1",
        className,
      )}
      {...props}
    />
  );
}
