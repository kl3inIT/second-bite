"use client";

import { CheckIcon, Share2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { buttonVariants } from "@/components/ui/button";

const COPIED_MS = 2000;

// Sharing a dish (Figma K4 "share"): the phone's own share sheet where there is one, otherwise its address
// copied, which the button confirms with a tick for a moment.
export function ShareButton({ title }: { title: string }) {
  const t = useTranslations("Dish");
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      // Closing the share sheet rejects; there is nothing to report.
      await navigator.share({ title, url }).catch(() => undefined);
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), COPIED_MS);
    } catch {
      // Without the clipboard there is no fallback left; the address bar still has the link.
    }
  }

  return (
    <button
      type="button"
      aria-label={copied ? t("copied") : t("share")}
      onClick={() => void share()}
      className={buttonVariants({ variant: "float", size: "float" })}
    >
      {copied ? (
        <CheckIcon aria-hidden strokeWidth={2.4} />
      ) : (
        <Share2Icon aria-hidden strokeWidth={2} />
      )}
    </button>
  );
}
