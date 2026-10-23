"use client";

import { BellOffIcon, BellRingIcon, ShareIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { FailureAlert, type Failure } from "@/components/failure-alert";
import { Button } from "@/components/ui/button";
import { failureOf } from "@/lib/api/client";
import { getPushKey } from "@/lib/api/generated";

import { followByPush, pushSupport } from "./push";

type Shown =
  | { kind: "nothing" }
  | { kind: "install" }
  | { kind: "ask"; key: string }
  | { kind: "blocked" }
  | { kind: "on" };

/**
 * Turns on Web Push for an order's customer or a store's people (SEC-25 › decision 10). The browser's prompt
 * comes only from the button, after our sentence. Once notifications are allowed in this browser, every visit
 * follows the topics again without asking, which renews them for seven days. An iPhone outside a Home Screen
 * app is shown the steps to add it; a refusal, how to undo it. Without push, in the browser or on the server, it
 * draws nothing. The seller's card is hidden after the founder's phone review; existing permission still
 * renews its topics quietly, without rendering a prompt, setup instructions, error or status.
 */
export function PushCard({ topics, side }: { topics: string[]; side: "customer" | "seller" }) {
  const t = useTranslations("Push");
  const [shown, setShown] = useState<Shown>({ kind: "nothing" });
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<Failure>();
  const topicsKey = topics.join(" ");

  useEffect(() => {
    const support = pushSupport();
    if (support === "unsupported") return;
    let current = true;
    getPushKey()
      .then(({ data }) => {
        if (!current) return;
        if (support === "install") setShown({ kind: "install" });
        else if (Notification.permission === "denied") setShown({ kind: "blocked" });
        else if (Notification.permission === "default")
          setShown({ kind: "ask", key: data.publicKey });
        else {
          setShown({ kind: "on" });
          // Renewing quietly: the person already said yes, and the next visit tries again.
          followByPush(topicsKey.split(" "), data.publicKey).catch(() => undefined);
        }
      })
      // Push is off on the server, or it did not answer: the page offers nothing.
      .catch(() => undefined);
    return () => {
      current = false;
    };
  }, [topicsKey]);

  if (side === "seller" || shown.kind === "nothing") return null;

  if (shown.kind === "on") {
    return (
      <p className="flex items-center gap-2 text-body-sm text-muted-foreground">
        <BellRingIcon aria-hidden className="size-4 shrink-0 text-primary" />
        {t(`on.${side}`)}
      </p>
    );
  }

  if (shown.kind === "blocked") {
    return (
      <section className="flex gap-3 rounded-2xl bg-card p-4 text-card-foreground">
        <BellOffIcon aria-hidden className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
        <div className="flex flex-col gap-1">
          <h2 className="text-body-sm-strong">{t("blockedTitle")}</h2>
          <p className="text-body-sm text-muted-foreground">{t("blockedBody")}</p>
        </div>
      </section>
    );
  }

  async function turnOn(key: string) {
    setFailure(undefined);
    setBusy(true);
    try {
      // Asked first, while the tap still counts: Safari shows its prompt only from a gesture.
      const permission = await Notification.requestPermission();
      if (permission === "denied") setShown({ kind: "blocked" });
      if (permission !== "granted") return;
      await followByPush(topicsKey.split(" "), key);
      setShown({ kind: "on" });
    } catch (error) {
      setFailure(failureOf(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      aria-labelledby={`push-${side}`}
      className="flex flex-col gap-3 rounded-2xl bg-card p-4 text-card-foreground"
    >
      <div className="flex gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <BellRingIcon aria-hidden className="size-5" />
        </span>
        <div className="flex flex-col gap-1">
          <h2 id={`push-${side}`} className="text-body-sm-strong">
            {t(`title.${side}`)}
          </h2>
          <p className="text-body-sm text-muted-foreground">{t(`body.${side}`)}</p>
        </div>
      </div>
      {shown.kind === "install" ? (
        <ol className="flex list-decimal flex-col gap-1 pl-5 text-body-sm">
          <li>
            {t.rich("install.share", {
              icon: () => (
                <ShareIcon
                  aria-label={t("install.shareIcon")}
                  className="inline size-4 align-text-bottom"
                />
              ),
            })}
          </li>
          <li>{t("install.add")}</li>
          <li>{t("install.open")}</li>
        </ol>
      ) : (
        <>
          {failure && <FailureAlert failure={failure} fallback={t("failed")} />}
          <Button className="self-start" disabled={busy} onClick={() => void turnOn(shown.key)}>
            {t("turnOn")}
          </Button>
        </>
      )}
    </section>
  );
}
