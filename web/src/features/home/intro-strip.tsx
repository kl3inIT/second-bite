"use client";

import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";

// What Second Bite is, for a first visit (no landing page in the first version, SEC-23). Closing it
// is remembered in this browser only; when storage is unavailable it simply shows again.
const storageKey = "second-bite:intro-dismissed";
const listeners = new Set<() => void>();
let hiddenForVisit = false;

function readDismissed() {
  try {
    return window.localStorage.getItem(storageKey) === "1";
  } catch {
    return false;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function dismiss() {
  try {
    window.localStorage.setItem(storageKey, "1");
  } catch {
    // Storage blocked: the strip still closes for this visit.
  }
  hiddenForVisit = true;
  for (const listener of listeners) listener();
}

export function IntroStrip() {
  const t = useTranslations("Intro");
  // The server renders nothing, so a returning visitor never sees the strip flash.
  const hidden = useSyncExternalStore(
    subscribe,
    () => hiddenForVisit || readDismissed(),
    () => true,
  );
  if (hidden) return null;

  return (
    <section
      aria-labelledby="intro-title"
      className="flex items-start gap-2 rounded-2xl bg-card p-4 text-card-foreground"
    >
      <div className="flex flex-1 flex-col gap-1">
        <h2 id="intro-title" className="text-title">
          {t("title")}
        </h2>
        <p className="text-body text-muted-foreground">{t("body")}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        aria-label={t("dismiss")}
        onClick={dismiss}
        className="-mt-2 -mr-2"
      >
        <XIcon aria-hidden />
      </Button>
    </section>
  );
}
