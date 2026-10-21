import {
  CheckIcon,
  ReceiptTextIcon,
  ShoppingBagIcon,
  StoreIcon,
  type LucideIcon,
} from "lucide-react";
import { Fragment } from "react";
import { useTranslations } from "next-intl";

import type { OrderBody } from "@/lib/api/generated";
import { cn } from "@/lib/utils";

const steps: { key: "placed" | "preparing" | "ready" | "collected"; icon: LucideIcon }[] = [
  { key: "placed", icon: ReceiptTextIcon },
  { key: "preparing", icon: StoreIcon },
  { key: "ready", icon: ShoppingBagIcon },
  { key: "collected", icon: CheckIcon },
];

/** The step an order is at: preparing from the moment it is placed, then ready, then done. */
function currentStep(status: OrderBody["status"]): number {
  if (status === "collected") return 3;
  return status === "ready" ? 2 : 1;
}

// The four steps of an order on the blue card (Figma Q5j, Q5k, O2, O3), the customer's own track seen from the
// counter: a circle for each, joined by lines. The steps passed and the current one are in the fresh colour, the
// rest dimmed, and the current one's name is strong, so it is never told by colour alone.
export function OrderTrack({ order }: { order: OrderBody }) {
  const t = useTranslations("StoreOrders.track");
  const reached = currentStep(order.status);

  return (
    <ol aria-label={t("label")} className="flex max-w-md items-start">
      {steps.map(({ key, icon: Icon }, index) => {
        const state = index < reached ? "done" : index === reached ? "now" : "later";
        return (
          <Fragment key={key}>
            {index > 0 && (
              <li
                aria-hidden
                className={cn(
                  "mt-3.75 h-0.75 min-w-3 flex-1 rounded-full",
                  index <= reached ? "bg-fresh" : "bg-primary-foreground/20",
                )}
              />
            )}
            <li
              aria-current={state === "now" ? "step" : undefined}
              className="flex w-16 shrink-0 flex-col items-center gap-2"
            >
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full",
                  state === "later"
                    ? "bg-primary-foreground/15 text-inverse-muted"
                    : "bg-fresh text-fresh-foreground",
                )}
              >
                <Icon aria-hidden className="size-4.5" />
              </span>
              <span
                className={cn(
                  "text-center text-label",
                  state === "now" && "text-label-strong text-fresh",
                  state === "done" && "text-primary-foreground",
                  state === "later" && "text-inverse-muted",
                )}
              >
                {t(key)}
              </span>
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}
