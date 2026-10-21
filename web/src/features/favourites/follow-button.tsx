"use client";

import { HeartIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { followedIds, toggleFollow, useFollows } from "./follows";

const TOAST_MS = 2500;

// The heart that follows a seller (SEC-109, Figma K9): `float` is the white round button over the seller's
// photographs (K4b), `card` the red heart of a card in "Yêu thích", `photo` the white heart on a dish's photograph.
// A tap says what it did in a short toast at the foot.
export function FollowButton({
  sellerId,
  name,
  look,
  className,
}: {
  sellerId: string;
  name: string;
  look: "float" | "card" | "photo";
  className?: string;
}) {
  const t = useTranslations("Favourites");
  const follows = useFollows();
  const followed = followedIds(follows).includes(sellerId);
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), TOAST_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  function toggle() {
    startTransition(async () => {
      try {
        setToast(t((await toggleFollow(sellerId)) ? "added" : "removed"));
      } catch {
        setToast(t("failed"));
      }
    });
  }

  return (
    <>
      <button
        type="button"
        aria-pressed={followed}
        aria-label={t("follow", { name })}
        disabled={follows.state === "loading" || pending}
        onClick={toggle}
        className={cn(
          look === "float" && buttonVariants({ variant: "float", size: "float" }),
          look === "card" &&
            "-m-2.75 flex size-11 shrink-0 items-center justify-center rounded-full text-destructive focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none",
          look === "photo" &&
            "absolute z-10 flex size-11 items-center justify-center rounded-full text-card focus-visible:ring-3 focus-visible:ring-card focus-visible:outline-none",
          className,
        )}
      >
        <HeartIcon
          aria-hidden
          className={cn(
            look === "card" ? "size-5.5" : "size-5",
            look === "photo" && "size-5.5 drop-shadow-md",
            followed && "fill-current",
          )}
        />
      </button>
      {toast && (
        <div className="pointer-events-none fixed inset-x-4 bottom-28 z-50 flex justify-center md:bottom-8">
          <output className="rounded-xl bg-foreground px-5 py-3 text-body-sm text-background shadow-lg">
            {toast}
          </output>
        </div>
      )}
    </>
  );
}
