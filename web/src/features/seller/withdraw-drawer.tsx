"use client";

import { CircleAlertIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { Link, useRouter } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { withdrawOffer } from "@/lib/api/generated";

import type { EditTarget } from "./post-draft";

// The drawer that withdraws a live post (SEC-57, Figma E3, E3b): a post nobody has ordered leaves the customers'
// pages at once and stays in "Đã đóng", where it can be posted again; one with orders is not withdrawn and the
// drawer says so, with the way to the orders. The reasons Figma asks for are not kept by the backend yet.
export function WithdrawDrawer({ sellerId, target }: { sellerId: string; target: EditTarget }) {
  const t = useTranslations("WithdrawDrawer");
  const kindName = useTranslations("OfferKind");
  const status = useTranslations("PostDrawer");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [failed, setFailed] = useState<{ reference?: string }>();
  const { dish, ordered } = target;
  const blocked = ordered > 0;

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
        setFailed({ reference: error instanceof ApiError ? error.requestId : undefined });
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

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 pb-4">
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
            {blocked ? t("blocked", { count: ordered }) : t("explain")}
          </p>
          <output className="rounded-xl bg-secondary px-4 py-3 text-title-lg text-secondary-foreground">
            {blocked ? t("blockedNote", { count: ordered }) : t("keptNote")}
          </output>
          {failed && (
            <Alert variant="destructive">
              <CircleAlertIcon aria-hidden />
              <AlertDescription>
                {t("failed")}
                {failed.reference && <> {t("reference", { id: failed.reference })}</>}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <SheetFooter variant="bar">
          <Button type="button" variant="outline" size="lg" disabled={pending} onClick={close}>
            {blocked ? t("close") : t("keep")}
          </Button>
          {blocked ? (
            <Link href={`/stores/${sellerId}/orders`} className={buttonVariants({ size: "lg" })}>
              {t("toOrders")}
            </Link>
          ) : (
            <Button type="button" size="lg" disabled={pending} onClick={withdraw}>
              {pending && <Spinner data-icon="inline-start" />}
              {t("withdraw")}
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
