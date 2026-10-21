"use client";

import { BellIcon, CheckIcon, HeartIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useSyncExternalStore, useTransition } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { followedIds, toggleFollow, useFollows } from "./follows";

const TOAST_MS = 2500;

// The last thing a heart did, shown by the one FollowToast in the layout: a heart on a card in "Yêu thích"
// leaves with its card as it is let go, so it cannot hold its own toast.
let toast: string | null = null;
let toastTimer: ReturnType<typeof setTimeout> | undefined;
const toastListeners = new Set<() => void>();

function showToast(message: string | null) {
  toast = message;
  clearTimeout(toastTimer);
  if (message) toastTimer = setTimeout(() => showToast(null), TOAST_MS);
  for (const listener of toastListeners) listener();
}

function subscribeToast(listener: () => void) {
  toastListeners.add(listener);
  return () => toastListeners.delete(listener);
}

// The heart that follows a seller (SEC-109, Figma K9): `float` is the white round button over the seller's
// photographs (K4b), `card` the red heart of a card in "Yêu thích", `photo` the white heart on a dish's photograph,
// `outline` the "Theo dõi" button beside the seller's name on a wide screen (Figma WK3), a pale "Đang theo dõi"
// once followed.
// A tap says what it did in a short toast at the foot.
export function FollowButton({
  sellerId,
  name,
  look,
  className,
}: {
  sellerId: string;
  name: string;
  look: "float" | "card" | "photo" | "outline";
  className?: string;
}) {
  const t = useTranslations("Favourites");
  const follows = useFollows();
  const followed = followedIds(follows).includes(sellerId);
  const [pending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      try {
        showToast(t((await toggleFollow(sellerId)) ? "added" : "removed"));
      } catch {
        showToast(t("failed"));
      }
    });
  }

  return (
    <button
      type="button"
      aria-pressed={followed}
      aria-label={t(look === "outline" ? "followName" : "follow", { name })}
      disabled={follows.state === "loading" || pending}
      onClick={toggle}
      className={cn(
        look === "float" && buttonVariants({ variant: "float", size: "float" }),
        look === "card" &&
          "-m-2.75 flex size-11 shrink-0 items-center justify-center rounded-full text-destructive focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none",
        look === "outline" &&
          cn(
            "flex min-h-11 items-center gap-1.5 rounded-md px-3 py-2 text-body-sm-strong text-primary focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none",
            followed ? "bg-muted" : "border-15 border-primary hover:bg-secondary",
          ),
        look === "photo" &&
          "absolute z-10 flex size-11 items-center justify-center rounded-full text-card focus-visible:ring-3 focus-visible:ring-card focus-visible:outline-none",
        className,
      )}
    >
      {look === "outline" ? (
        <>
          {followed ? (
            <CheckIcon aria-hidden className="size-4" />
          ) : (
            <BellIcon aria-hidden className="size-4" />
          )}
          {t(followed ? "followingLabel" : "followLabel")}
        </>
      ) : (
        <HeartIcon
          aria-hidden
          className={cn(
            look === "card" ? "size-5.5" : "size-5",
            look === "photo" && "size-5.5 drop-shadow-md",
            followed && "fill-current",
          )}
        />
      )}
    </button>
  );
}

/** What a heart just did, in a short toast at the foot of any page (SEC-109). */
export function FollowToast() {
  const message = useSyncExternalStore(
    subscribeToast,
    () => toast,
    () => null,
  );
  useEffect(() => () => clearTimeout(toastTimer), []);
  if (!message) return null;

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-28 z-50 flex justify-center md:bottom-8">
      <output className="rounded-xl bg-foreground px-5 py-3 text-body-sm text-background shadow-lg">
        {message}
      </output>
    </div>
  );
}
