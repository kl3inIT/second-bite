"use client";

import { revalidateLogic } from "@tanstack/react-form";
import { CircleCheckIcon, ClockIcon, MessageCircleWarningIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { z } from "zod";

import { refuse, useAppForm } from "@/components/form/app-form";
import { useFieldValidity } from "@/components/form/form-context";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "@/i18n/navigation";
import { reportOrderProblem, type ProblemBody } from "@/lib/api/generated";

import type { Order } from "./order";

const KINDS = ["missing_item", "wrong_item", "poor_quality", "store_closed"] as const;
type Kind = (typeof KINDS)[number];

/** The server's bound on a note (server/internal/order, maxProblemLetters). */
const NOTE_LIMIT = 500;

// A kind's chip, as the cancel reasons' (Figma D6): white on a pale blue edge, Tasco blue words; the chosen one
// filled. The 44px target is the invisible area around it.
const CHIP =
  "relative h-8 rounded-full border border-secondary bg-card px-3.5 text-note font-medium text-primary after:absolute after:inset-x-0 after:-inset-y-1.5 aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none";

/**
 * What a customer can do about a problem with a collected or expired order (SEC-84): report it while they may
 * (Figma D5 › "Báo vấn đề với đơn", D6), then read it with the store's answer (D6b, D6c).
 */
export function OrderProblem({ order }: { order: Order }) {
  if (order.problem) return <ProblemCard problem={order.problem} seller={order.seller.name} />;
  if (order.canReportProblem) return <ReportProblem order={order} />;
  return null;
}

/** The problem reported, when it went to the store and its answer, or that the answer is awaited (D6b, D6c). */
function ProblemCard({ problem, seller }: { problem: ProblemBody; seller: string }) {
  const t = useTranslations("OrderProblem");
  const format = useFormatter();
  const at = (value: string) => format.dateTime(new Date(value), "time");
  const reported = at(problem.reportedAt);

  return (
    <section
      aria-labelledby="order-problem"
      className="flex flex-col gap-3.5 rounded-2xl bg-card px-4 pt-4 pb-4.5 text-card-foreground"
    >
      <h2 id="order-problem" className="text-label-strong text-muted-foreground uppercase">
        {t("reportedTitle")}
      </h2>
      <ol className="flex flex-col gap-3.5">
        <Moment
          title={t(`kind.${problem.kind}`)}
          body={problem.note ? t("noteAt", { time: reported, note: problem.note }) : reported}
        />
        <Moment title={t("sent", { seller })} body={reported} />
        {problem.answer && problem.answeredAt ? (
          <Moment
            title={t("answered", { seller, time: at(problem.answeredAt) })}
            body={problem.answer}
          />
        ) : (
          <li className="flex items-center gap-3">
            <ClockIcon aria-hidden className="size-6 shrink-0 text-muted-foreground" />
            <p className="text-label text-muted-foreground">{t("waiting")}</p>
          </li>
        )}
      </ol>
    </section>
  );
}

function Moment({ title, body }: { title: string; body: string }) {
  return (
    <li className="flex items-center gap-3">
      <CircleCheckIcon
        aria-hidden
        className="size-6 shrink-0 fill-success text-success-foreground"
      />
      <div className="flex min-w-0 flex-col">
        <p className="text-body-sm-strong">{title}</p>
        <p className="text-label break-words whitespace-pre-line text-muted-foreground">{body}</p>
      </div>
    </li>
  );
}

// Reporting a problem (Figma D6): in a sheet from the foot on a phone, a dialog on a wider screen, as cancelling is.
// The page reads the order again afterwards and shows the report. An order placed without signing in is reported
// with its access (SEC-76 › decision 7).
function ReportProblem({ order }: { order: Order }) {
  const t = useTranslations("OrderProblem");
  const phone = useIsMobile();
  const [open, setOpen] = useState(false);
  const form = open && <ReportForm order={order} onDone={() => setOpen(false)} />;

  return (
    <>
      <Button variant="link" className="min-h-11 self-center" onClick={() => setOpen(true)}>
        <MessageCircleWarningIcon aria-hidden data-icon="inline-start" />
        {t("open")}
      </Button>
      {phone ? (
        <Drawer open={open} onOpenChange={setOpen} showSwipeHandle>
          <DrawerContent>
            <div className="mx-auto flex w-full max-w-xl flex-col gap-3 px-5 pt-2.5 pb-8.5">
              <DrawerTitle>{t("title", { number: order.number })}</DrawerTitle>
              <DrawerDescription>{t("body")}</DrawerDescription>
              {form}
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent showCloseButton={false} className="sm:max-w-120">
            <DialogTitle size="headline">{t("title", { number: order.number })}</DialogTitle>
            <DialogDescription>{t("body")}</DialogDescription>
            {form}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

function ReportForm({ order, onDone }: { order: Order; onDone: () => void }) {
  const t = useTranslations("OrderProblem");
  const router = useRouter();

  const form = useAppForm({
    defaultValues: { kind: undefined as Kind | undefined, note: "" },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: z.object({
        kind: z.custom<Kind | undefined>().refine((kind) => kind !== undefined, t("errors.kind")),
        note: z.string().max(NOTE_LIMIT),
      }),
    },
    onSubmit: async ({ value, formApi }) => {
      const note = value.note.trim();
      try {
        await reportOrderProblem({
          path: { orderId: order.id },
          headers: order.access ? { "Order-Access": order.access } : undefined,
          body: { kind: value.kind as Kind, ...(note ? { note } : {}) },
        });
      } catch (error) {
        refuse(formApi, error);
        return;
      }
      onDone();
      router.refresh();
    },
  });

  return (
    <form
      id={form.formId}
      noValidate
      className="flex flex-col gap-3.5"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.AppField name="kind">{() => <KindField />}</form.AppField>
      <form.AppField name="note">
        {(field) => (
          <label className="flex flex-col gap-2">
            <span className="text-body-sm-strong">{t("note")}</span>
            <Textarea
              surface="sky"
              value={field.state.value}
              maxLength={NOTE_LIMIT}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
              placeholder={t("notePlaceholder")}
            />
          </label>
        )}
      </form.AppField>
      <form.AppForm>
        <form.FormError fallback={t("failed")} />
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(submitting) => (
            <div className="flex flex-col gap-2 pt-1.5 md:grid md:grid-cols-2 md:gap-3 md:pt-0">
              <form.SubmitButton size="lg">{t("send")}</form.SubmitButton>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="md:order-first"
                disabled={submitting}
                onClick={onDone}
              >
                {t("later")}
              </Button>
            </div>
          )}
        </form.Subscribe>
      </form.AppForm>
    </form>
  );
}

/** The four kinds, one to choose, as toggle chips; sent without one, it says so under them. */
function KindField() {
  const t = useTranslations("OrderProblem");
  const { field, invalid, errors, ids } = useFieldValidity<Kind | undefined>();
  return (
    <fieldset
      className="flex min-w-0 flex-col gap-2"
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? ids.error : undefined}
    >
      <legend className="mb-2 text-note font-semibold text-muted-foreground">
        {t("kindLegend")}
      </legend>
      <div className="flex flex-wrap gap-2">
        {KINDS.map((kind) => (
          <button
            key={kind}
            type="button"
            aria-pressed={field.state.value === kind}
            onClick={() => field.handleChange(kind)}
            className={CHIP}
          >
            {t(`kind.${kind}`)}
          </button>
        ))}
      </div>
      {invalid && <FieldError id={ids.error} errors={errors} />}
    </fieldset>
  );
}
