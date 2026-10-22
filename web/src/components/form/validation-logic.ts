// Adapted from BeyondPilot's web/src/components/form/validation-logic.ts (revision 5fd043a8).
import { defaultValidationLogic, type ValidationLogicFn } from "@tanstack/react-form";

/**
 * The validation logic every form of the application runs, around the one the form chose. It
 * changes two things in how a submit checks the fields, which it does one by one, without the
 * form's validators, before the form's own rules run.
 *
 * Each field's `onServer` entry is evaluated again, so a field with no validator of its own does
 * not keep the violation the server placed on it and block every later submit.
 *
 * A field is checked by its own rules only. For a field that has any validator, the library lists
 * every kind of rule a submit runs, with nothing to run for the kinds the field lacks, and writes
 * "no error" under each: what the form found for the field under that kind is wiped, and when
 * another field is still refused the submit stops before the form looks again. The kinds the field
 * has no rule for are left out, so the form's error stays until the form's own rules clear it. The
 * `server` kind stays in, as it is what clears a server's violation.
 */
export function clearingServerErrors(
  logic: ValidationLogicFn = defaultValidationLogic,
): ValidationLogicFn {
  return (props) =>
    logic({
      ...props,
      runValidation: ({ validators, form }) => {
        if (props.event.type !== "submit" || props.event.async) {
          return props.runValidation({ validators, form });
        }
        const own =
          props.event.fieldName === undefined
            ? validators
            : validators.filter((validator) => validator?.fn || validator?.cause === "server");
        return props.runValidation({
          validators: own.some((validator) => validator?.cause === "server")
            ? own
            : [...own, { fn: undefined, cause: "server" }],
          form,
        });
      },
    });
}

/**
 * Keeps what a submit refused until it is corrected, around the validation logic of a form.
 *
 * The library takes a field's `onSubmit` error away at the first check that is not a submit and
 * finds nothing wrong, without looking at the rule that set it: leaving the field is such a check,
 * so tabbing on from the field the refusal moved focus to hid its error while it was still wrong.
 * It concerns the forms and the fields whose rules are `onSubmit` ones; an `onDynamic` rule is
 * checked again by `revalidateLogic` and never met this.
 *
 * Once the form has been submitted, a change and a blur check the `onSubmit` rules again, the
 * form's and the field's own: the error stays while the value is refused, goes when it is
 * accepted, and comes back if it is made wrong again, as in a form checked by `onDynamic`. Before
 * the first submit nothing changes, and an asynchronous rule still waits for the submit.
 */
export function keepingSubmitErrors(
  logic: ValidationLogicFn = defaultValidationLogic,
): ValidationLogicFn {
  return (props) =>
    logic({
      ...props,
      runValidation: ({ validators, form }) => {
        const { type, async, fieldName } = props.event;
        const rule = props.validators?.onSubmit;
        const checksAgain =
          !async &&
          !props.group &&
          (type === "change" || type === "blur") &&
          props.form.state.submissionAttempts > 0 &&
          // A field passes on what the form found for it, so it is asked even without a rule.
          (fieldName !== undefined || rule !== undefined);
        return props.runValidation({
          validators: checksAgain ? [...validators, { fn: rule, cause: "submit" }] : validators,
          form,
        });
      },
    });
}
