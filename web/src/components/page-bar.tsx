import { BackButton } from "./back-button";
import { CustomerHeader } from "./customer-header";

// The blue top bar of an inner screen (Figma "Top bar" on Tasco blue: K5, D1, D5): its white back button, unless
// the screen is a tab of its own, and the screen's name as its heading. From `md` the screen has the customer
// header instead (Figma WK5): the wordmark, the place, the search field and the account; the page names itself
// in its content. `returnTo` is where the sign-in leads back to.
export function PageBar({
  title,
  back,
  returnTo,
}: {
  title: string;
  back?: string;
  returnTo: string;
}) {
  return (
    <>
      <header className="bg-header text-header-foreground md:hidden">
        <div className="mx-auto flex h-16 w-full max-w-xl items-center gap-3 px-4">
          {back ? <BackButton fallback={back} /> : null}
          <h1 className="truncate text-bar-title">{title}</h1>
        </div>
      </header>
      <CustomerHeader returnTo={returnTo} />
    </>
  );
}
