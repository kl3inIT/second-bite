"use client";

import { revalidateLogic } from "@tanstack/react-form";
import { MessageCircleWarningIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { z } from "zod";

import { refuse, useAppForm } from "@/components/form/app-form";
import { useRouter } from "@/i18n/navigation";
import { answerOrderProblem, type OrderBody, type ProblemBody } from "@/lib/api/generated";

/** The server's bound on an answer (server/internal/order, maxProblemLetters). */
const ANSWER_LIMIT = 500;

/**
 * The problem a customer reported with the order, for its store (SEC-84, Figma Q5p on the web, O3p on a phone): what
 * went wrong and their note, then the answer form, or the answer given. Answered once; the customer reads it on
 * their order's page and is told by Web Push.
 */
export function StoreProblem({ order }: { order: OrderBody }) {
  const t = useTranslations("StoreProblem");
  const format = useFormatter();
  const problem = order.problem;
  if (!problem) return null;

  const reported = format.dateTime(new Date(problem.reportedAt), "time");

  return (
    <section
      aria-labelledby={`store-problem-${order.id}`}
      className="flex flex-col gap-3 rounded-3xl bg-card p-5 text-card-foreground"
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-warning text-warning-foreground"
        >
          <MessageCircleWarningIcon className="size-5" />
        </span>
        <div className="flex min-w-0 flex-col">
          <h2 id={`store-problem-${order.id}`} className="text-body-sm-strong">
            {t("title", { kind: t(`kind.${problem.kind}`) })}
          </h2>
          <p className="text-label break-words whitespace-pre-line text-muted-foreground">
            {problem.note
              ? t("noteAt", { note: problem.note, time: reported })
              : t("at", { time: reported })}
          </p>
        </div>
      </div>
      {problem.answer && problem.answeredAt ? (
        <Answered problem={problem} />
      ) : (
        <AnswerForm orderId={order.id} />
      )}
    </section>
  );
}

function Answered({ problem }: { problem: ProblemBody }) {
  const t = useTranslations("StoreProblem");
  const format = useFormatter();
  return (
    <div className="flex flex-col gap-1 border-t border-border pt-3">
      <p className="text-label-strong text-muted-foreground">
        {t("answeredAt", {
          time: format.dateTime(new Date(problem.answeredAt ?? problem.reportedAt), "time"),
        })}
      </p>
      <p className="text-body-sm break-words whitespace-pre-line">{problem.answer}</p>
    </div>
  );
}

// Answering is a form (docs/guidelines/web.md › Forms): a blank or too long answer is said at its field, a refusal
// in the server's words above the button; the page reads the order again afterwards and shows the answer.
function AnswerForm({ orderId }: { orderId: string }) {
  const t = useTranslations("StoreProblem");
  const router = useRouter();

  const form = useAppForm({
    defaultValues: { answer: "" },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: z.object({
        answer: z.string().trim().min(1, t("errors.answer")).max(ANSWER_LIMIT, t("errors.answer")),
      }),
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await answerOrderProblem({ path: { orderId }, body: { answer: value.answer.trim() } });
      } catch (error) {
        refuse(formApi, error);
        return;
      }
      router.refresh();
    },
  });

  return (
    <form
      id={form.formId}
      noValidate
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.AppField name="answer">
        {(field) => (
          <field.TextareaField
            label={t("answer")}
            placeholder={t("answerPlaceholder")}
            maxLength={ANSWER_LIMIT}
          />
        )}
      </form.AppField>
      <form.AppForm>
        <form.FormError fallback={t("failed")} />
        <form.SubmitButton size="lg">{t("send")}</form.SubmitButton>
      </form.AppForm>
    </form>
  );
}
