// Adapted from BeyondPilot's web/src/components/form/app-form.ts (revision 5fd043a8). Second Bite
// shows the server's own sentence for a refusal (SEC-28), so `refuse` places `error.detail` where
// BeyondPilot translates the code.
import { createFormHook, type AnyFormApi } from "@tanstack/react-form";
import { useId } from "react";

import type { Failure } from "@/components/failure-alert";
import { ApiError, failureOf } from "@/lib/api/client";

import { focusFirstInvalidSoon } from "./focus-first-invalid";
import { fieldContext, formContext } from "./form-context";
import { FormError, SubmitButton, TextareaField, TextField } from "./form-fields";
import { clearingServerErrors, keepingSubmitErrors } from "./validation-logic";

const appForm = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField, TextareaField },
  formComponents: { SubmitButton, FormError },
});

/** The `<form>` element of a form: the one that carries `id={form.formId}`. */
const elementOf = (formApi: AnyFormApi) => () => document.getElementById(formApi.formId);

/**
 * The web's TanStack Form hook (docs/guidelines/web.md › Forms): `form.AppField` binds the shared
 * controls and `form.AppForm` the form-level parts. A refused submission's errors, set with
 * {@link refuse}, clear when the person edits the form or submits again; what the form's rules
 * refused stays on its field until the value is accepted.
 *
 * The form's id, React's own unless the caller names one, starts the id of every control in it, so
 * a dialog's form never shares an id with the page's. A submit the rules refuse moves focus to the
 * first field in error, found inside `<form id={form.formId}>`.
 */
export const useAppForm: typeof appForm.useAppForm = (options) => {
  const id = useId();
  return appForm.useAppForm({
    ...options,
    formId: options.formId ?? id,
    validationLogic: keepingSubmitErrors(clearingServerErrors(options.validationLogic)),
    onSubmitInvalid: (props) => {
      options.onSubmitInvalid?.(props);
      focusFirstInvalidSoon(elementOf(props.formApi));
    },
  });
};

/** A refused submission's errors: the failure no field can say, and the messages on its fields. */
type ServerErrors = {
  form?: Failure;
  fields: Record<string, { message: string } | undefined>;
};

/** The field a refused member names: `#/senderAddress` is `senderAddress`, `#/lines/0/units` is `lines[0].units`. */
function fieldOfPointer(pointer: string | undefined) {
  const parts = pointer?.replace(/^#?\//, "").split("/") ?? [];
  if (parts.length === 0 || parts[0] === "") return undefined;
  return parts
    .map((part, at) => (/^\d+$/.test(part) ? `[${part}]` : at ? `.${part}` : part))
    .join("");
}

/**
 * Shows why the server refused a submission: each refused member under the field it names, and a
 * code the screen ties to a field (`fieldOfCode`, for a refusal that names no member) under that
 * field. What no field of the form can say, a failure without an answer included, goes above the
 * form (`FormError`). Focus moves to the first field in error.
 *
 * The errors go under the `onServer` key, which TanStack Form clears on the next change, blur or
 * submit, so a corrected field does not stay refused.
 */
export function refuse(
  formApi: AnyFormApi,
  error: unknown,
  fieldOfCode: Readonly<Record<string, string>> = {},
) {
  const known = (name: string | undefined): name is string =>
    name !== undefined && formApi.getFieldMeta(name) !== undefined;
  const fields: ServerErrors["fields"] = {};
  if (error instanceof ApiError) {
    for (const violation of error.violations) {
      const name = fieldOfPointer(violation.pointer);
      if (known(name)) fields[name] = { message: violation.detail ?? error.detail ?? "" };
    }
    const named = error.code ? fieldOfCode[error.code] : undefined;
    if (known(named) && !fields[named]) fields[named] = { message: error.detail ?? "" };
  }
  const errors: ServerErrors = {
    form: Object.keys(fields).length > 0 ? undefined : failureOf(error),
    fields,
  };
  formApi.setErrorMap({ onServer: errors });
  focusFirstInvalidSoon(elementOf(formApi));
}
