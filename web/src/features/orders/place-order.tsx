"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { formatPrice } from "@/features/offers/format";
import { Link, useRouter } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { placeOrder } from "@/lib/api/generated";

type Problem = { kind: "gone" } | { kind: "failed"; reference?: string };

function problemOf(error: unknown): Problem {
  const code = error instanceof ApiError ? error.code : undefined;
  // The offer sold out or closed between the page and the press (Figma W1b): nothing was taken.
  if (code === "ORDER_OFFER_SOLD_OUT" || code === "ORDER_OFFER_UNAVAILABLE")
    return { kind: "gone" };
  return { kind: "failed", reference: error instanceof ApiError ? error.requestId : undefined };
}

export type OrderableOffer = {
  id: string;
  name: string;
  priceVnd: number;
  originalPriceVnd: number;
  unitsLeft: number;
};

/** A row of the summary: what on the left, how much on the right. */
function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className={strong ? "text-body-sm-strong" : "text-body-sm text-muted-foreground"}>
        {label}
      </span>
      <span className={strong ? "font-display text-price" : "text-body-sm"}>{value}</span>
    </div>
  );
}

// The order summary of the confirm page (Figma W1 › Tóm tắt đơn; Mobbin: Instacart's and Shop's panels): the
// line with its units, what it costs, no fee and no commission, then the total and "Đặt món". One key per
// visit goes with every press, so a second press or a retried request returns the order placed first
// (SEC-15 › Idempotency). Someone signed out is sent to sign in and comes back with the same units.
export function PlaceOrder({
  offer,
  initialUnits,
  signedIn,
}: {
  offer: OrderableOffer;
  initialUnits: number;
  signedIn: boolean;
}) {
  const t = useTranslations("Orders.place");
  const router = useRouter();
  const [units, setUnits] = useState(initialUnits);
  const [key] = useState(() => crypto.randomUUID());
  const [problem, setProblem] = useState<Problem>();
  const [pending, startTransition] = useTransition();
  const total = offer.priceVnd * units;
  const original = offer.originalPriceVnd * units;

  function place() {
    setProblem(undefined);
    startTransition(async () => {
      try {
        const { data } = await placeOrder({
          headers: { "Idempotency-Key": key },
          body: { lines: [{ offerId: offer.id, units }] },
        });
        router.push(`/orders/${data.id}`);
      } catch (error) {
        setProblem(problemOf(error));
      }
    });
  }

  return (
    <section
      aria-labelledby="place-order"
      className="flex flex-col gap-3 rounded-3xl bg-card p-5 text-card-foreground"
    >
      <h2 id="place-order" className="text-title">
        {t("summary")}
      </h2>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-col">
          <p className="text-body-sm">{offer.name}</p>
          <p className="text-label text-muted-foreground">
            {t("left", { units: offer.unitsLeft })}
          </p>
        </div>
        <fieldset className="flex shrink-0 items-center gap-1">
          <legend className="sr-only">{t("units")}</legend>
          <Button
            variant="secondary"
            size="icon"
            aria-label={t("fewer")}
            disabled={units <= 1 || pending}
            onClick={() => setUnits(units - 1)}
          >
            <MinusIcon />
          </Button>
          <output aria-live="polite" className="w-7 text-center font-display text-price">
            {units}
          </output>
          <Button
            variant="secondary"
            size="icon"
            aria-label={t("more")}
            disabled={units >= offer.unitsLeft || pending}
            onClick={() => setUnits(units + 1)}
          >
            <PlusIcon />
          </Button>
        </fieldset>
      </div>
      <div className="flex flex-col gap-2 border-t border-border pt-3">
        <Row label={t("subtotal", { units })} value={formatPrice(total)} />
        <Row label={t("fee")} value={t("none")} />
        <Row label={t("total")} value={formatPrice(total)} strong />
        <p className="text-label text-muted-foreground">
          {t("noCommission", { total: formatPrice(total) })}
        </p>
      </div>
      {problem ? (
        <div role="alert" className="flex flex-col gap-2 rounded-2xl bg-muted p-3">
          <p className="text-body-sm-strong">
            {problem.kind === "gone" ? t("goneTitle") : t("failedTitle")}
          </p>
          <p className="text-body-sm text-muted-foreground">
            {problem.kind === "gone"
              ? t("goneBody")
              : t("failedBody", { reference: problem.reference ?? "—" })}
          </p>
          {problem.kind === "gone" ? (
            <Link href="/" className={buttonVariants({ variant: "outline" })}>
              {t("other")}
            </Link>
          ) : null}
        </div>
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <div className="flex flex-col">
          <p className="flex items-baseline gap-2">
            <span className="font-display text-price-lg text-primary">{formatPrice(total)}</span>
            <s aria-hidden className="text-label text-muted-foreground">
              {formatPrice(original)}
            </s>
          </p>
          <p className="text-label-strong">
            {t("saving", { units, saving: formatPrice(original - total) })}
          </p>
        </div>
        {signedIn ? (
          <Button size="lg" disabled={pending || problem?.kind === "gone"} onClick={place}>
            {pending ? <Spinner data-icon="inline-start" /> : null}
            {t("submit")}
          </Button>
        ) : (
          <Link
            href={{
              pathname: "/sign-in",
              query: { returnTo: `/orders/new?offer=${offer.id}&units=${units}` },
            }}
            className={buttonVariants({ size: "lg" })}
          >
            {t("signInFirst")}
          </Link>
        )}
      </div>
      {signedIn ? null : <p className="text-label text-muted-foreground">{t("signInWhy")}</p>}
    </section>
  );
}
