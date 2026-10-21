"use client";

import { CheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { vietnamDay } from "../promotions/schedule";
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-page-title text-foreground">{t("title")}</h1>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" id={soonId}>
            {tShell("soon")}
          </Badge>
          <Button variant="outline" disabled aria-describedby={soonId}>
            {t("test")}
          </Button>
          <Button disabled aria-describedby={soonId}>
            <CheckIcon data-icon="inline-start" aria-hidden />
            {t("schedule")}
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <section aria-labelledby="compose-form-title" className="min-w-0 flex-1">
          <Card>
            <CardHeader>
              <CardTitle>
                <h2 id="compose-form-title">{t("formTitle")}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-5">
                <ComposeFields form={form} onChange={setForm} />
              </div>
            </CardContent>
          </Card>
        </section>
        <section aria-labelledby="compose-preview-title" className="lg:w-110 lg:shrink-0">
          <Card>
            <CardHeader>
              <CardTitle>
                <h2 id="compose-preview-title">{t("previewTitle")}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <NotificationPreview
                channel={form.channel}
                title={form.title}
                body={form.body}
                day={form.day}
                time={form.time}
              />
            </CardContent>
          </Card>
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
  const titleProblem = touched.title && problems.includes("title");
  const bodyProblem = touched.body && problems.includes("body");

  return (
    <>
      <FieldSet>
        <FieldLegend variant="label">{t("channel")}</FieldLegend>
        <ToggleGroup
          variant="outline"
          value={[form.channel]}
          onValueChange={([channel]) => {
            if (channel) set({ channel: channel as NotificationChannel });
          }}
          className="max-w-full overflow-x-auto"
        >
          {notificationChannels.map((channel) => (
            <ToggleGroupItem key={channel} value={channel} className="h-11">
              {t(`channels.${channel}`)}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend variant="label">{t("audience")}</FieldLegend>
        <ToggleGroup
          variant="outline"
          value={[form.audience]}
          onValueChange={([audience]) => {
            if (audience) set({ audience: audience as NotificationAudience });
          }}
          className="max-w-full overflow-x-auto"
        >
          {notificationAudiences.map((audience) => (
            <ToggleGroupItem key={audience} value={audience} className="h-11">
              {t(`audiences.${audience}`)}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </FieldSet>

      <Field data-invalid={titleProblem || undefined}>
        <FieldLabel htmlFor={`${id}-title`}>{t("titleField")}</FieldLabel>
        <Input
          id={`${id}-title`}
          value={form.title}
          maxLength={composeLimits.title}
          autoComplete="off"
          aria-invalid={titleProblem || undefined}
          aria-describedby={titleProblem ? `${id}-title-problem` : undefined}
          onChange={(event) => set({ title: event.target.value })}
          onBlur={() => setTouched((current) => ({ ...current, title: true }))}
        />
        {titleProblem && <FieldError id={`${id}-title-problem`}>{t("titleProblem")}</FieldError>}
      </Field>

      <Field data-invalid={bodyProblem || undefined}>
        <FieldLabel htmlFor={`${id}-body`}>{t("body")}</FieldLabel>
        <Textarea
          id={`${id}-body`}
          value={form.body}
          rows={3}
          maxLength={composeLimits.body}
          aria-invalid={bodyProblem || undefined}
          aria-describedby={bodyProblem ? `${id}-body-problem` : undefined}
          onChange={(event) => set({ body: event.target.value })}
          onBlur={() => setTouched((current) => ({ ...current, body: true }))}
        />
        {bodyProblem && <FieldError id={`${id}-body-problem`}>{t("bodyProblem")}</FieldError>}
      </Field>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Field>
          <FieldLabel htmlFor={`${id}-day`}>{t("day")}</FieldLabel>
          <Input
            id={`${id}-day`}
            type="date"
            value={form.day}
            min={today}
            onChange={(event) => {
              const day = event.target.value;
              if (day) setForm((current) => withDay(current, day, new Date()));
            }}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor={`${id}-time`}>{t("time")}</FieldLabel>
          <Input
            id={`${id}-time`}
            type="time"
            value={form.time}
            min={form.quiet ? quietHours.until : undefined}
            max={form.quiet ? quietHours.lastMinute : undefined}
            onChange={(event) => {
              const time = event.target.value;
              if (time) setForm((current) => withTime(current, time));
            }}
          />
        </Field>
      </div>

      <Field orientation="horizontal" className="min-h-11">
        <Switch
          id={`${id}-quiet`}
          checked={form.quiet}
          onCheckedChange={(quiet) => setForm((current) => withQuiet(current, quiet))}
        />
        <FieldLabel htmlFor={`${id}-quiet`}>{t("quiet")}</FieldLabel>
      </Field>
    </>
  );
}
