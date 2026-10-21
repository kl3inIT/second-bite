"use client";

import { CheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  ChoiceRow,
  FieldLabel,
  FieldProblem,
  GroupLabel,
  SwitchField,
  TextField,
} from "../ui/form-fields";
import { vietnamDay } from "../promotions/schedule";
import { SoonBadge } from "../ui/soon-badge";
import { PageHeader } from "../ui/page-header";
import { SegmentedControl } from "../ui/segmented-control";
import {
  blankCompose,
  type ComposeForm,
  composeLimits,
  composeProblems,
  type NotificationAudience,
  notificationAudiences,
  type NotificationChannel,
  notificationChannels,
  quietHours,
  withDay,
  withQuiet,
  withTime,
} from "./campaign";
import { NotificationPreview } from "./notification-preview";

/**
 * Writing a notification to a group (Figma AD-MK6): push or email, to whom, its title and text, the day and time
 * it goes, kept out of the quiet hours; beside it the notification as people will get it. The day never goes
 * before today and the time out of the quiet hours while they are kept. Nothing sends to a group yet, so "Gửi
 * thử" and "Lên lịch" stay disabled beside "Sắp có".
 */
export function ComposeEditor() {
  const t = useTranslations("admin.notifications.compose");
  const tShell = useTranslations("admin.shell");
  const soonId = useId();
  const [form, setForm] = useState(() => blankCompose(new Date()));

  return (
    <>
      <PageHeader
        title={t("title")}
        actions={
          <>
            <SoonBadge id={soonId} />
            <Button variant="outline" disabled title={tShell("soon")} aria-describedby={soonId}>
              {t("test")}
            </Button>
            <Button disabled title={tShell("soon")} aria-describedby={soonId}>
              <CheckIcon data-icon="inline-start" aria-hidden />
              {t("schedule")}
            </Button>
          </>
        }
      />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <section
          aria-labelledby="compose-form-title"
          className="flex min-w-0 flex-1 flex-col gap-5 rounded-2xl border border-border bg-card p-6"
        >
          <h2 id="compose-form-title" className="text-title-lg text-foreground">
            {t("formTitle")}
          </h2>
          <ComposeFields form={form} onChange={setForm} />
        </section>
        <section
          aria-labelledby="compose-preview-title"
          className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 lg:w-110 lg:shrink-0"
        >
          <h2 id="compose-preview-title" className="text-title-lg text-foreground">
            {t("previewTitle")}
          </h2>
          <NotificationPreview
            channel={form.channel}
            title={form.title}
            body={form.body}
            day={form.day}
            time={form.time}
          />
        </section>
      </div>
    </>
  );
}

/** The composer's fields, top to bottom as Figma AD-MK6 draws them. `onChange` takes the next form from the last. */
export function ComposeFields({
  form,
  onChange: setForm,
}: {
  form: ComposeForm;
  onChange: (next: (current: ComposeForm) => ComposeForm) => void;
}) {
  const t = useTranslations("admin.notifications.compose");
  const id = useId();
  const [touched, setTouched] = useState({ title: false, body: false });
  // Today in Vietnam, read once: the earliest day to send on.
  const [today] = useState(() => vietnamDay(new Date()));
  const problems = composeProblems(form);
  const set = (change: Partial<ComposeForm>) => setForm((current) => ({ ...current, ...change }));
  const bodyProblem = touched.body && problems.includes("body");

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <GroupLabel>{t("channel")}</GroupLabel>
        <ChoiceRow>
          <SegmentedControl<NotificationChannel>
            label={t("channel")}
            value={form.channel}
            segments={notificationChannels.map((channel) => ({
              value: channel,
              label: t(`channels.${channel}`),
            }))}
            onChange={(channel) => set({ channel })}
          />
        </ChoiceRow>
      </div>

      <div className="flex flex-col gap-1.5">
        <GroupLabel>{t("audience")}</GroupLabel>
        <ChoiceRow>
          <SegmentedControl<NotificationAudience>
            label={t("audience")}
            value={form.audience}
            segments={notificationAudiences.map((audience) => ({
              value: audience,
              label: t(`audiences.${audience}`),
            }))}
            onChange={(audience) => set({ audience })}
          />
        </ChoiceRow>
      </div>

      <TextField
        id={`${id}-title`}
        label={t("titleField")}
        value={form.title}
        maxLength={composeLimits.title}
        onChange={(title) => set({ title })}
        onBlur={() => setTouched((current) => ({ ...current, title: true }))}
        problem={touched.title && problems.includes("title") ? t("titleProblem") : undefined}
      />

      <div className="flex flex-col gap-1.5">
        <FieldLabel htmlFor={`${id}-body`}>{t("body")}</FieldLabel>
        <Textarea
          id={`${id}-body`}
          value={form.body}
          rows={3}
          maxLength={composeLimits.body}
          aria-invalid={bodyProblem ? true : undefined}
          aria-describedby={bodyProblem ? `${id}-body-problem` : undefined}
          onChange={(event) => set({ body: event.target.value })}
          onBlur={() => setTouched((current) => ({ ...current, body: true }))}
        />
        {bodyProblem && <FieldProblem id={`${id}-body-problem`}>{t("bodyProblem")}</FieldProblem>}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <TextField
          id={`${id}-day`}
          type="date"
          label={t("day")}
          value={form.day}
          min={today}
          onChange={(day) => day && setForm((current) => withDay(current, day, new Date()))}
        />
        <TextField
          id={`${id}-time`}
          type="time"
          label={t("time")}
          value={form.time}
          min={form.quiet ? quietHours.until : undefined}
          max={form.quiet ? quietHours.lastMinute : undefined}
          onChange={(time) => time && setForm((current) => withTime(current, time))}
        />
      </div>

      <SwitchField
        label={t("quiet")}
        checked={form.quiet}
        onChange={(quiet) => setForm((current) => withQuiet(current, quiet))}
      />
    </>
  );
}
