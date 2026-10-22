"use client";

import { useEffect, useRef } from "react";

import { toast } from "@/components/ui/toast";
import { useRouter } from "@/i18n/navigation";

// What a change did, said after it (Figma P5, S1: "Đã đăng 3 suất. Khách đặt được ngay."): the page that the
// change led to carries `notice` in its address, and this raises the toast once; the notice leaves the address with
// the toast, so a later reload does not say it again. `to` is the address without it.
export function PostToast({ message, to }: { message: string; to: string }) {
  const router = useRouter();
  const raised = useRef(false);

  useEffect(() => {
    if (raised.current) return;
    raised.current = true;
    toast.add({
      type: "success",
      title: message,
      // Only while the page still says it: a person who has moved on is not brought back.
      onClose: () => {
        const here = window.location.pathname.endsWith(to.split("?")[0]);
        if (here && new URLSearchParams(window.location.search).has("notice")) {
          router.replace(to, { scroll: false });
        }
      },
    });
  }, [message, router, to]);

  return null;
}
