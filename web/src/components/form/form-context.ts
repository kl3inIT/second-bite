// Adapted from BeyondPilot's web/src/components/form/form-context.ts (revision 5fd043a8), without its
// "every field required unless Optional" mode, which no Second Bite form uses.
import { createFormHookContexts } from "@tanstack/react-form";
import { useLayoutEffect, useRef } from "react";

import { fieldIds } from "./field-ids";

/** The contexts the shared field and form components read; `useAppForm` provides them. */
const contexts = createFormHookContexts();
export const { fieldContext, formContext, useFormContext } = contexts;
const { useFieldContext } = contexts;

/** Validation errors as `FieldError` lists them: zod issues and server messages alike. */
function messagesOf(errors: unknown[]) {
  return errors.map((error) =>
    typeof error === "string"
      ? { message: error }
      : error &&
          typeof error === "object" &&
          "message" in error &&
          typeof error.message === "string"
        ? { message: error.message }
        : undefined,
  );
}

/**
 * The bound field with whether it shows as invalid and its messages for `FieldError`. A field shows
 * its errors once touched, which submitting does for every field. A control composed by hand inside
 * `form.AppField` uses it to set `data-invalid` on `Field` and `aria-invalid` on the control, and
 * takes from `ids` the id of the control, of its hint and of its error.
 *
 * `spoken` says whether the error announces itself (`role="alert"`): only when a rule checked while
 * typing or on leaving the field set it. After a submit the focus moves to the first field in error,
 * which is read with its error.
 */
export function useFieldValidity<TValue>() {
  const field = useFieldContext<TValue>();
  const { isTouched, isValid, errors, errorMap } = field.state.meta;
  return {
    field,
    invalid: isTouched && !isValid,
    errors: messagesOf(errors),
    ids: fieldIds(field),
    spoken: Boolean(errorMap.onChange || errorMap.onBlur),
  };
}

/**
 * A ref for a text control bound to its field that keeps what the person typed before the page hydrated. Until
 * then the server's HTML takes the typing, or the browser fills a saved password in, and React leaves that on the
 * screen; the field takes it when the control mounts, so a submit sends what the person sees rather than an
 * empty field. Once mounted, the control and its field agree, so it does nothing after a client render.
 */
export function useValueTypedEarly<TElement extends HTMLInputElement | HTMLTextAreaElement>() {
  const field = useFieldContext<string>();
  const ref = useRef<TElement>(null);
  useLayoutEffect(() => {
    const shown = ref.current?.value;
    if (shown !== undefined && shown !== field.state.value) field.handleChange(shown);
    // Only what was typed before the control mounted; after that, its onChange keeps the field.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return ref;
}
