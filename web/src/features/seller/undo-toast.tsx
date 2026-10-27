"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import { toast } from "@/components/ui/toast";
import { usePathname, useRouter } from "@/i18n/navigation";
import { failureOf } from "@/lib/api/client";
import { reopenOrder } from "@/lib/api/generated";

const SHOWN_FOR_MS = 8000;

// The toast after "Đã giao" (Figma Q5d): who the order went to, and "Hoàn tác" for a tap by mistake, as the toast's
// action. The `undo` in the address, which carries the order's identifier and nothing of the customer, raises it
// once and leaves the address with the toast. An undo the server refuses says why in a toast of its own.
export function UndoToast({ orderId, message }: { orderId: string; message: string }) {
  const t = useTranslations("StoreOrders");
  const router = useRouter();
  const pathname = usePathname();
  const raised = useRef(false);

  useEffect(() => {
    if (raised.current) return;
    raised.current = true;
    // Only while the page still holds this undo: a person who has moved on is not brought back.
    const leave = () => {
      const query = Object.fromEntries(new URLSearchParams(window.location.search));
      if (query.undo !== orderId) return;
      delete query.undo;
      router.replace({ pathname, query }, { scroll: false });
    };

    const id = toast.add({
      type: "success",
      title: message,
      timeout: SHOWN_FOR_MS,
      onClose: leave,
      actionProps: {
        children: t("reopen"),
        onClick: () => {
          toast.close(id);
          void (async () => {
            try {
              await reopenOrder({ path: { orderId } });
            } catch (error) {
              const { detail } = failureOf(error);
              toast.add({ type: "error", title: detail ?? t("failed") });
            }
            router.refresh();
          })();
        },
      },
    });
  }, [message, orderId, pathname, router, t]);

  return null;
}
