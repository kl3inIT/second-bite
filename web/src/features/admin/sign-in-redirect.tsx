"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";

// Someone not signed in who opens an admin page goes to sign in and comes back to that page (SEC-29's
// `returnTo`). A layout is not told its address, so the address is read here, in the browser.
export function SignInRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const query = useSearchParams().toString();

  useEffect(() => {
    const returnTo = query ? `${pathname}?${query}` : pathname;
    router.replace({ pathname: "/sign-in", query: { returnTo } });
  }, [router, pathname, query]);

  return null;
}
