"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

const COPIED_MS = 2000;

// Copies a customer's phone number (Figma Q5): the staff call whoever has not come, and paste it where they dial.
// The button confirms with a tick for a moment and says so to a screen reader.
export function CopyPhoneButton({ phone }: { phone: string }) {
  const t = useTranslations("StoreOrders");
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
      setTimeout(() => setCopied(false), COPIED_MS);
    } catch {
      // Without the clipboard the number is still on the row, to read and dial.
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label={t("copyPhone", { phone })}
        onClick={() => void copy()}
        className="relative flex size-5 items-center justify-center rounded-sm text-muted-foreground transition-colors outline-none after:absolute after:-inset-3 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {copied ? (
          <CheckIcon aria-hidden className="size-4" strokeWidth={2.4} />
        ) : (
          <CopyIcon aria-hidden className="size-4" strokeWidth={2} />
        )}
      </button>
      <output className="sr-only">{copied ? t("copied") : ""}</output>
    </>
  );
}
