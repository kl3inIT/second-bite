"use client";

import { useEffect } from "react";

import { useRouter } from "@/i18n/navigation";

const SHOWN_FOR_MS = 6000;

// The line at the foot of the screen after a change (Figma P5, S1: "Đã đăng 3 suất. Khách đặt được ngay."): a
// status the screen reader announces, which takes itself away, with the address it came with. `to` is the
// address without it.
export function PostToast({ message, to }: { message: string; to: string }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.replace(to, { scroll: false }), SHOWN_FOR_MS);
    return () => clearTimeout(timer);
  }, [router, to]);

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-8 z-40 flex justify-center">
      <output className="rounded-xl bg-primary px-5 py-4 text-body-sm-strong text-primary-foreground shadow-lg">
        {message}
      </output>
    </div>
  );
}
