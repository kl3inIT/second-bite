"use client";

import { LockIcon, SendIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { ScrollRow } from "@/components/scroll-row";
import { Button } from "@/components/ui/button";
import type { Side } from "@/lib/live-client";

/** The longest message the API takes (docs/specs/order.md › The chat). */
const MAX_LENGTH = 1000;

/** The words under the messages once the chat can no longer be written in (Figma K7b). */
function Locked() {
  const t = useTranslations("Chat");

  return (
    <footer className="flex items-center justify-center gap-2 border-t border-border bg-card px-4 pt-4.5 pb-8.5 text-body-sm font-medium text-muted-foreground">
      <LockIcon aria-hidden className="size-4.5 shrink-0" />
      {t("locked")}
    </footer>
  );
}

/**
 * The foot of a chat (Figma K7, Q7, WK8, Q5m): the note that messages change nothing of the order, quick replies
 * that send at once and go while a person types, and the field with its send button. The camera button of the
 * design waits for photos (phase 2, design decision 23). Once the chat is read-only the foot says so instead
 * (Figma K7b).
 */
export function ChatFooter({
  side,
  locked,
  onSend,
}: {
  side: Side;
  locked: boolean;
  onSend: (text: string) => void;
}) {
  const t = useTranslations("Chat");
  const [text, setText] = useState("");
  if (locked) return <Locked />;

  const replies =
    side === "customer"
      ? (["coming", "late", "stillHave"] as const).map((key) => t(`customerReplies.${key}`))
      : (["ready", "working", "holding"] as const).map((key) => t(`sellerReplies.${key}`));
  const placeholder = t(side === "customer" ? "placeholderToStore" : "placeholderToCustomer");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const body = text.trim();
    if (!body) return;
    onSend(body);
    setText("");
  }

  return (
    <footer className="flex flex-col gap-2 border-t border-border bg-card pt-3 pb-5">
      <p className="px-4 text-label text-muted-foreground">{t("note")}</p>
      {text === "" ? (
        <ScrollRow label={t("quickReplies")} className="gap-2 pb-0">
          {replies.map((reply) => (
            <li key={reply} className="snap-start">
              <button
                type="button"
                onClick={() => onSend(reply)}
                className="relative flex h-8 items-center rounded-full border border-secondary bg-card px-3.5 text-note font-medium whitespace-nowrap text-primary transition-colors after:absolute after:inset-x-0 after:-inset-y-2 hover:bg-secondary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                {reply}
              </button>
            </li>
          ))}
        </ScrollRow>
      ) : null}
      <form onSubmit={submit} className="flex items-center gap-2 px-4">
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          maxLength={MAX_LENGTH}
          autoComplete="off"
          enterKeyHint="send"
          aria-label={placeholder}
          placeholder={placeholder}
          className="h-11 min-w-0 flex-1 rounded-full bg-background px-4.5 text-body text-foreground placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none md:text-body-sm"
        />
        <Button type="submit" size="icon" aria-label={t("send")} disabled={text.trim() === ""}>
          <SendIcon aria-hidden className="size-5" />
        </Button>
      </form>
    </footer>
  );
}
