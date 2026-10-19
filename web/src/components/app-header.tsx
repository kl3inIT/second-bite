import { HeaderSweep } from "./header-sweep";
import { LanguageSwitcher } from "./language-switcher";

// The lime header of the home (Figma header): what the page names itself with and the language
// capsule, then what the page puts under them, under the leaf sweep and with rounded bottom corners.
export function AppHeader({
  title,
  children,
}: {
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="relative overflow-hidden rounded-b-3xl bg-header text-header-foreground">
      <HeaderSweep />
      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-4">
          {title}
          <LanguageSwitcher />
        </div>
        {children}
      </div>
    </header>
  );
}
