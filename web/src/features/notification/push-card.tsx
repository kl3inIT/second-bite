"use client";

import { BellOffIcon, BellRingIcon, ShareIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { z } from "zod";

import { FailureAlert, type Failure } from "@/components/failure-alert";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { failureOf } from "@/lib/api/client";
import { getPushKey } from "@/lib/api/generated";
import { stored } from "@/lib/stored";

import { followByPush, pushSupport } from "./push";

type Shown =
  | { kind: "nothing" }
  | { kind: "install" }
  | { kind: "ask"; key: string }
  | { kind: "blocked" }
  | { kind: "on" };

// "Để sau" on the offer, kept in this browser: later orders do not offer notices again (SEC-189).
const later = stored<boolean>("secondbite.push-later", z.boolean(), false);

/**
 * Turns on Web Push for an order's customer or a store's people (SEC-25 › decision 10). The browser's prompt
 * comes only from the button, after our sentence. Once notifications are allowed in this browser, every visit
 * follows the topics again without asking, which renews them for seven days. Without push, in the browser or on
 * the server, it draws nothing. The seller's card is hidden after the founder's phone review; existing permission
 * still renews its topics quietly, without rendering a prompt, setup instructions, error or status.
 *
 * The customer's offer is one row under the ticket (SEC-189): "Để sau" puts it away in this browser; an iPhone
 * outside a Home Screen app opens the steps to add it from "Xem cách"; a refusal is one quiet line whose
 * "Cách bật lại" opens how to undo it.
 */
export function PushCard({ topics, side }: { topics: string[]; side: "customer" | "seller" }) {
  const t = useTranslations("Push");
  const [shown, setShown] = useState<Shown>({ kind: "nothing" });
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<Failure>();
  const postponed = later.useValue();
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
      <p className="flex items-center gap-2 px-1 text-body-sm text-muted-foreground">
        <BellRingIcon aria-hidden className="size-4 shrink-0 text-primary" />
        {t(`on.${side}`)}
      </p>
    );
  }

  if (shown.kind === "blocked") {
    return (
      <Collapsible>
        <div className="flex flex-col gap-2 px-1 text-body-sm text-muted-foreground">
          <p className="flex flex-wrap items-center gap-x-2">
            <BellOffIcon aria-hidden className="size-4 shrink-0" />
            <span>{t("blocked")}</span>
            <CollapsibleTrigger render={<Button variant="link" size="inline" />}>
              {t("howToUndo")}
            </CollapsibleTrigger>
          </p>
          <CollapsibleContent>
            <p className="rounded-2xl bg-card p-4 text-card-foreground">{t("blockedBody")}</p>
          </CollapsibleContent>
        </div>
      </Collapsible>
    );
  }

  if (postponed) return null;

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

  const install = shown.kind === "install";

  return (
    <section aria-labelledby={`push-${side}`} className="rounded-2xl bg-card text-card-foreground">
      <Collapsible>
        <div className="flex flex-wrap items-center gap-x-2 py-1.5 pr-1.5 pl-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <BellRingIcon aria-hidden className="size-4" />
          </span>
          <div className="flex min-w-40 flex-1 flex-col py-1.5">
            <h2 id={`push-${side}`} className="text-body-sm-strong">
              {t(`title.${side}`)}
            </h2>
            {install && <p className="text-body-sm text-muted-foreground">{t("install.needed")}</p>}
          </div>
          {/* With the iPhone's second line, or a phone's large text, the actions take a line of their own. */}
          <div className="ml-auto flex items-center">
            <Button variant="ghost" onClick={() => later.save(true)}>
              {t("later")}
            </Button>
            {install ? (
              <CollapsibleTrigger render={<Button variant="link" />}>
                {t("install.how")}
              </CollapsibleTrigger>
            ) : (
              <Button disabled={busy} onClick={() => void turnOn(shown.key)}>
                {t("turnOn")}
              </Button>
            )}
          </div>
        </div>
        {failure && (
          <div className="px-3 pb-3">
            <FailureAlert failure={failure} fallback={t("failed")} />
          </div>
        )}
        {install && (
          <CollapsibleContent>
            <ol className="flex list-decimal flex-col gap-1 pr-4 pb-4 pl-15 text-body-sm">
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
          </CollapsibleContent>
        )}
      </Collapsible>
    </section>
  );
}
