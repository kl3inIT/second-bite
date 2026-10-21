import { BackButton } from "./back-button";

// The blue top bar of an inner screen (Figma "Top bar" on Tasco blue: K5, D1, D5): its white back button, unless
// the screen is a tab of its own, and the screen's name as its heading.
export function PageBar({ title, back }: { title: string; back?: string }) {
  return (
    <header className="bg-header text-header-foreground">
      <div className="mx-auto flex h-16 w-full max-w-xl items-center gap-3 px-4 md:max-w-292">
        {back ? <BackButton fallback={back} /> : null}
        <h1 className="truncate text-bar-title">{title}</h1>
      </div>
    </header>
  );
}
