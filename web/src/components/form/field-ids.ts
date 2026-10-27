// Adapted from BeyondPilot's web/src/components/form/field-ids.ts (revision 5fd043a8).
/** What the ids of a field are made from: its name and the form it belongs to. */
type FieldOfForm = { name: string; form: { formId: string } };

/**
 * The id of the control of the field `name` in `form`. It starts with the form's id, so two forms
 * in one document, a dialog over a page, never share an id however their fields are named. It
 * holds the name as written, dots and brackets included: find the element with
 * `document.getElementById` or an attribute selector, never with `#id`.
 */
export function fieldIdOf(form: { formId: string }, name: string) {
  return `${form.formId}-${name}`;
}

/**
 * The ids of a field's control, its hint and its error, as the shared controls write them. A
 * control composed by hand inside `form.Field` or `form.AppField` takes its ids from here, so its
 * label, its `aria-describedby` and the code that moves focus to it agree.
 */
export function fieldIds(field: FieldOfForm) {
  const control = fieldIdOf(field.form, field.name);
  return { control, hint: `${control}-hint`, error: `${control}-error` };
}
