"use client";

// Adapted from BeyondPilot's web/src/components/form/form-fields.tsx (revision 5fd043a8): the text
// controls, the submit button and the form's own error. A control the set lacks (a choice of chips,
// a photo, a number) is composed from the `field` parts inside `form.AppField` with
// `useFieldValidity`, as BeyondPilot does.
import type { ComponentProps, ReactNode } from "react";

import { FailureAlert, type Failure } from "@/components/failure-alert";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

import { useFieldValidity, useFormContext } from "./form-context";

type Labelled = {
  label: ReactNode;
  description?: ReactNode;
  /** Says to a screen reader that the field must be filled (`aria-required`); the form's rules check it. */
  required?: boolean;
};

/**
 * The parts every text control shares: its ids, whether it is invalid, its error's role and the
 * `aria-describedby` tying the hint and the error to the control.
 */
function useDescribed<TValue>(description: ReactNode) {
  const { field, invalid, errors, ids, spoken } = useFieldValidity<TValue>();
  const worded = invalid && errors.some((error) => error?.message);
  const describedBy =
    [description ? ids.hint : undefined, worded ? ids.error : undefined]
      .filter(Boolean)
      .join(" ") || undefined;
  return { field, invalid, errors, ids, describedBy, errorRole: spoken ? "alert" : undefined };
}

type TextFieldProps = Labelled &
  Omit<ComponentProps<"input">, "id" | "name" | "value" | "onChange" | "onBlur" | "required">;

/** A line of text bound to its field. */
export function TextField({ label, description, required, ...input }: TextFieldProps) {
  const { field, invalid, errors, ids, describedBy, errorRole } = useDescribed<string>(description);
  return (
    <Field data-invalid={invalid || undefined}>
      <FieldLabel htmlFor={ids.control}>{label}</FieldLabel>
      <Input
        {...input}
        id={ids.control}
        name={field.name}
        value={field.state.value}
        aria-invalid={invalid || undefined}
        aria-required={required || undefined}
        aria-describedby={describedBy}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
      />
      {description && <FieldDescription id={ids.hint}>{description}</FieldDescription>}
      {invalid && <FieldError id={ids.error} role={errorRole} errors={errors} />}
    </Field>
  );
}

type TextareaFieldProps = Labelled &
  Omit<ComponentProps<"textarea">, "id" | "name" | "value" | "onChange" | "onBlur" | "required">;

/** Several lines of text bound to their field. */
export function TextareaField({ label, description, required, ...textarea }: TextareaFieldProps) {
  const { field, invalid, errors, ids, describedBy, errorRole } = useDescribed<string>(description);
  return (
    <Field data-invalid={invalid || undefined}>
      <FieldLabel htmlFor={ids.control}>{label}</FieldLabel>
      <Textarea
        {...textarea}
        id={ids.control}
        name={field.name}
        value={field.state.value}
        aria-invalid={invalid || undefined}
        aria-required={required || undefined}
        aria-describedby={describedBy}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
      />
      {description && <FieldDescription id={ids.hint}>{description}</FieldDescription>}
      {invalid && <FieldError id={ids.error} role={errorRole} errors={errors} />}
    </Field>
  );
}

/** The form's submit: a spinner and no second press while it is sent. */
export function SubmitButton({
  children,
  disabled,
  ...button
}: Omit<ComponentProps<typeof Button>, "type">) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(submitting) => (
        <Button {...button} type="submit" form={form.formId} disabled={disabled || submitting}>
          {submitting && <Spinner data-icon="inline-start" />}
          {children}
        </Button>
      )}
    </form.Subscribe>
  );
}

/**
 * What a refused submit could not say under a field (`refuse` in app-form.ts): the server's sentence
 * and its reference, or `fallback` when no answer came. Nothing while there is none.
 */
export function FormError({ fallback, title }: { fallback: string; title?: string }) {
  const form = useFormContext();
  return (
    // TanStack Form keeps the `form` part of the errors `refuse` gave as the form's own error.
    <form.Subscribe selector={(state) => state.errorMap.onServer as Failure | undefined}>
      {(failure) =>
        failure ? <FailureAlert failure={failure} fallback={fallback} title={title} /> : null
      }
    </form.Subscribe>
  );
}
