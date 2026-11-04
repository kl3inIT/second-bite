import type { ReactNode } from "react";
import { Suspense } from "react";

import { TopBar } from "@/components/top-bar";
import { Skeleton } from "@/components/ui/skeleton";

// The frame of the screens that sign a person in or make an account (SEC-29 › Web, SEC-193), reached when an action
// needs an account, with `returnTo` naming the page to go back to. On a phone the form fills the screen under the
// white top bar; on a tablet it sits on a 440 px card (Figma W1, W2); from 1024 px the page splits in two, the blue
// panel and the bare form (Figma L6, L9, L10, L11, L12; SEC-56).
export function AuthScreen({
  title,
  back,
  hero,
  children,
}: {
  title: string;
  /** The page to go back to, which the phone's top bar names. */
  back: Promise<string>;
  hero: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <div className="lg:hidden">
        <Suspense fallback={<TopBar title={title} back="/" />}>
          <BackToReturn title={title} back={back} />
        </Suspense>
      </div>
      <main
        data-no-footer
        className="flex flex-1 justify-center bg-card sm:bg-background sm:px-4 sm:py-10 lg:grid lg:min-h-svh lg:grid-cols-5 lg:p-0"
      >
        {hero}
        <div className="w-full px-4 py-6 sm:h-fit sm:max-w-110 sm:rounded-2xl sm:bg-card sm:p-8 lg:col-span-3 lg:m-auto lg:max-w-100 lg:rounded-none lg:bg-transparent lg:p-0">
          <Suspense fallback={<AuthSkeleton />}>{children}</Suspense>
        </div>
      </main>
    </>
  );
}

async function BackToReturn({ title, back }: { title: string; back: Promise<string> }) {
  return <TopBar title={title} back={await back} />;
}

function AuthSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-5">
      <Skeleton className="h-7 w-56" />
      <Skeleton className="h-11" />
      <Skeleton className="h-11" />
      <Skeleton className="h-13" />
    </div>
  );
}
