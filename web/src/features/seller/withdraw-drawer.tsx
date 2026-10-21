"use client";

import { CircleAlertIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "@/i18n/navigation";
import { failureOf } from "@/lib/api/client";
import { withdrawOffer } from "@/lib/api/generated";

import type { EditTarget } from "./post-draft";

// The drawer that withdraws a live post (SEC-57, Figma E3, E3b): the post leaves the customers' pages at once and
// stays in "Đã đóng", where it can be posted again. A post with orders is withdrawn too (SEC-108): the drawer
// says the orders end with it, and the customers who hold them read "Quán đã rút bài". The reasons Figma asks for
// are not kept by the backend yet.
export function WithdrawDrawer({ sellerId, target }: { sellerId: string; target: EditTarget }) {
  const t = useTranslations("WithdrawDrawer");
  const kindName = useTranslations("OfferKind");
  const status = useTranslations("PostDrawer");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [failed, setFailed] = useState<{ detail?: string; reference?: string }>();
  const { dish, ordered } = target;
  const hasOrders = ordered > 0;

  function close() {
    router.push(`/stores/${sellerId}/offers`);
  }

  function withdraw() {
    setFailed(undefined);
    startTransition(async () => {
      try {
        await withdrawOffer({ path: { offerId: target.offerId } });
        router.push({
          pathname: `/stores/${sellerId}/offers`,
          query: { tab: "closed", notice: "withdrawn" },
        });
        router.refresh();
      } catch (error) {
        setFailed(failureOf(error));
      }
    });
  }

  return (
    <Sheet open onOpenChange={(open) => !open && close()}>
      <SheetContent size="wide" showCloseButton={false}>
        <SheetHeader variant="bar">
          <SheetTitle variant="headline">{t("title")}</SheetTitle>
          <span className="text-body-sm text-muted-foreground">
            {status(`editStatus.${target.status}`)}
          </span>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4 sm:px-6">
          <h3 className="border-b border-border pb-3 text-title-lg">{t("question")}</h3>
          <div className="flex items-center gap-4">
            <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
              <Image
                src={`/api${dish.photoPath}`}
                alt=""
                fill
                sizes="56px"
                unoptimized
                className="object-cover"
              />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-title-lg">{dish.name}</span>
              <span className="text-body-sm text-muted-foreground">
                {kindName(dish.kind)} · {dish.unit}
              </span>
            </span>
          </div>
          <p className="text-note text-muted-foreground">
            {hasOrders ? t("explainOrders", { count: ordered }) : t("explain")}
          </p>
          <output
            className={
              hasOrders
                ? "rounded-xl border border-warning-border bg-warning px-4 py-3 text-title-lg text-warning-foreground"
                : "rounded-xl bg-secondary px-4 py-3 text-title-lg text-secondary-foreground"
            }
          >
            {hasOrders ? t("ordersNote", { count: ordered }) : t("keptNote")}
          </output>
          {failed && (
            <Alert variant="destructive">
              <CircleAlertIcon aria-hidden />
              <AlertDescription>
                {failed.detail ?? t("failed")}
                {failed.detail && failed.reference && (
                  <> {t("reference", { id: failed.reference })}</>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <SheetFooter variant="bar">
          <Button type="button" variant="outline" size="lg" disabled={pending} onClick={close}>
            {t("keep")}
          </Button>
          <Button
            type="button"
            variant={hasOrders ? "destructive" : "default"}
            size="lg"
            disabled={pending}
            onClick={withdraw}
          >
            {pending && <Spinner data-icon="inline-start" />}
            {hasOrders ? t("withdrawAndCancel") : t("withdraw")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
