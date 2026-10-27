"use client";

import { BellIcon, CheckIcon, HeartIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";

import { buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

import { followedIds, toggleFollow, useFollows } from "./follows";

const TOAST_MS = 2500;

// The last thing a heart did, said in the layout's toast: a heart on a card in "Yêu thích" leaves with its card
// as it is let go, so the toast is not its own. Only the latest is shown, as a new tap replaces what it said.
let lastToast: string | undefined;

function showToast(message: string, type: "success" | "error") {
  if (lastToast) toast.close(lastToast);
  lastToast = toast.add({ type, title: message, timeout: TOAST_MS });
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
        showToast(t((await toggleFollow(sellerId)) ? "added" : "removed"), "success");
      } catch {
        showToast(t("failed"), "error");
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
