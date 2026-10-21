"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useTransition } from "react";

import { Spinner } from "@/components/ui/spinner";
import { usePathname, useRouter } from "@/i18n/navigation";
import { reopenOrder } from "@/lib/api/generated";

const SHOWN_FOR_MS = 8000;

// The line at the foot after "Đã giao" (Figma Q5d): who the order went to, and "Hoàn tác" for a tap by mistake. It
// takes itself away with the `undo` in the address, which carries the order's identifier and nothing of the customer.
export function UndoToast({ orderId, message }: { orderId: string; message: string }) {
  const t = useTranslations("StoreOrders");
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const leave = useCallback(() => {
    const query = Object.fromEntries(new URLSearchParams(window.location.search));
    delete query.undo;
    router.replace({ pathname, query }, { scroll: false });
  }, [router, pathname]);

  useEffect(() => {
    const timer = setTimeout(leave, SHOWN_FOR_MS);
    return () => clearTimeout(timer);
  }, [leave]);

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-24 z-50 flex justify-center md:bottom-8">
      <output className="pointer-events-auto flex items-center gap-5 rounded-xl bg-foreground py-2 pr-2 pl-5 text-body-sm text-background shadow-lg">
        {message}
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              try {
                await reopenOrder({ path: { orderId } });
              } finally {
                leave();
                router.refresh();
              }
            })
          }
          className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-body-sm-strong text-primary-foreground/90 underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring disabled:opacity-60"
        >
          {pending && <Spinner />}
          {t("reopen")}
        </button>
      </output>
    </div>
  );
}
