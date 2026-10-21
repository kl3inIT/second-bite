import { FieldApi, FormApi, revalidateLogic, type ValidationLogicFn } from "@tanstack/react-form";
import { describe, expect, it } from "vitest";

import { clearingServerErrors, keepingSubmitErrors } from "./validation-logic";

// A form as `useAppForm` sets it up, driven as the screen drives it: fields are mounted, typed into,
// left, and the form is submitted. The form's own rules refuse an empty `name` and an empty `phone`.

type Values = { name: string; phone: string; rows: { title: string }[] };
/** A mounted field, as loosely typed as the names the tests give it. */
type Mounted = {
  handleChange: (value: unknown) => void;
  handleBlur: () => void;
  pushValue: (value: unknown) => void;
  removeValue: (index: number) => void;
};

const required = ({ value }: { value: Values }) => {
  const fields = {
    ...(value.name ? {} : { name: "name required" }),
    ...(value.phone ? {} : { phone: "phone required" }),
    ...Object.fromEntries(
      value.rows.flatMap((row, index) =>
        row.title ? [] : [[`rows[${index}].title`, "title required"]],
      ),
    ),
  };
  return Object.keys(fields).length > 0 ? { fields } : undefined;
};

function formWith(validators: object, logic?: ValidationLogicFn) {
  const seen = { submitted: 0 };
  const form = new FormApi({
    defaultValues: { name: "", phone: "", rows: [] } as Values,
    validationLogic: keepingSubmitErrors(clearingServerErrors(logic)),
    validators: validators as never,
    onSubmit: () => {
      seen.submitted += 1;
    },
  });
  form.mount();
  const field = (name: string, own?: object) => {
    const api = new FieldApi({
      form: form as never,
      name: name as never,
      validators: own as never,
    });
    api.mount();
    return api as unknown as Mounted;
  };
  /** The errors the fields hold, as the controls would show them. */
  const errors = () =>
    Object.fromEntries(
      Object.entries(form.state.fieldMeta as Record<string, { errors: unknown[] }>)
        .filter(([, meta]) => meta.errors.length > 0)
        .map(([name, meta]) => [name, meta.errors]),
    );
  return { form, seen, field, errors };
}

/** A rule of the field itself that passes whatever is typed, as a format check passes an empty value. */
const lenient = () => undefined;

describe("a field with a validator of its own, in a form with rules of its own", () => {
  it.each([
    ["checked again as the person types", { onDynamic: required }, revalidateLogic()],
    ["checked on submit", { onSubmit: required }, undefined],
  ])(
    "keeps the form's error through a second refused submit, in a form %s",
    async (_, rules, logic) => {
      const { form, seen, field, errors } = formWith(rules, logic);
      const name = field("name");
      field("phone", { onChange: lenient });

      await form.handleSubmit();
      expect(errors()).toEqual({ name: ["name required"], phone: ["phone required"] });

      // Nothing was corrected: both are refused still, the one with its own rule included.
      await form.handleSubmit();
      expect(errors()).toEqual({ name: ["name required"], phone: ["phone required"] });

      // And it goes when what the form refused is corrected.
      name.handleChange("An");
      form.setFieldValue("phone", "+84 912 345 678");
      await form.handleSubmit();
      expect(errors()).toEqual({});
      expect(seen.submitted).toBe(1);
    },
  );

  it("still runs its own rules on change, on blur and on submit", async () => {
    const { form, seen, field, errors } = formWith({ onDynamic: required }, revalidateLogic());
    field("name").handleChange("An");
    const phone = field("phone", {
      onChange: ({ value }: { value: string }) => (/[a-z]/.test(value) ? "no letters" : undefined),
      onBlur: ({ value }: { value: string }) => (value.length < 4 ? "too short" : undefined),
      onSubmit: ({ value }: { value: string }) => (value === "0000" ? "not a number" : undefined),
    });

    phone.handleChange("ab");
    expect(errors()).toEqual({ phone: ["no letters"] });
    phone.handleChange("12");
    expect(errors()).toEqual({});
    phone.handleBlur();
    expect(errors()).toEqual({ phone: ["too short"] });
    phone.handleChange("0000");
    phone.handleBlur();
    expect(errors()).toEqual({});

    await form.handleSubmit();
    expect(errors()).toEqual({ phone: ["not a number"] });
    expect(seen.submitted).toBe(0);

    phone.handleChange("0912");
    await form.handleSubmit();
    expect(errors()).toEqual({});
    expect(seen.submitted).toBe(1);
  });

  it("still waits for its asynchronous rule, and is refused by it", async () => {
    const { form, seen, field, errors } = formWith({ onDynamic: required }, revalidateLogic());
    field("name").handleChange("An");
    const phone = field("phone", {
      onSubmitAsync: async ({ value }: { value: string }) =>
        value === "taken" ? "already used" : undefined,
    });

    phone.handleChange("taken");
    await form.handleSubmit();
    expect(errors()).toEqual({ phone: ["already used"] });
    expect(seen.submitted).toBe(0);

    phone.handleChange("free");
    await form.handleSubmit();
    expect(errors()).toEqual({});
    expect(seen.submitted).toBe(1);
  });

  it("keeps the form's error on a row of a list, and drops it with the row", async () => {
    const { form, field, errors } = formWith({ onDynamic: required }, revalidateLogic());
    field("name");
    field("phone").handleChange("0912");
    const rows = field("rows");
    rows.pushValue({ title: "" });
    field("rows[0].title", { onChange: lenient });

    await form.handleSubmit();
    await form.handleSubmit();
    expect(errors()).toEqual({ name: ["name required"], "rows[0].title": ["title required"] });

    rows.removeValue(0);
    await form.handleSubmit();
    expect(errors()).toEqual({ name: ["name required"] });
  });
});

describe("what the server refused", () => {
  const refuse = (form: { setErrorMap: (map: never) => void }) =>
    form.setErrorMap({
      onServer: { fields: { name: "name taken", phone: "phone taken" } },
    } as never);

  it("clears on every field once the person edits the form", () => {
    const { form, field, errors } = formWith({ onDynamic: required }, revalidateLogic());
    const name = field("name");
    field("phone", { onChange: lenient });
    refuse(form);
    expect(errors()).toEqual({ name: ["name taken"], phone: ["phone taken"] });

    name.handleChange("An");
    expect(errors()).toEqual({});
  });

  it.each([
    ["checked again as the person types", { onDynamic: required }, revalidateLogic()],
    ["checked on submit", { onSubmit: required }, undefined],
  ])("clears on every field at the next submit, in a form %s", async (_, rules, logic) => {
    const { form, seen, field, errors } = formWith(rules, logic);
    form.setFieldValue("name", "An");
    form.setFieldValue("phone", "0912");
    field("name");
    field("phone", { onChange: lenient });

    // The server refuses what the form let through; sent again as it is, it goes through.
    await form.handleSubmit();
    refuse(form);
    expect(errors()).toEqual({ name: ["name taken"], phone: ["phone taken"] });
    await form.handleSubmit();

    expect(errors()).toEqual({});
    expect(seen.submitted).toBe(2);
  });
});

describe("what a submit refused", () => {
  const forms: [string, object, ValidationLogicFn | undefined][] = [
    ["checked again as the person types", { onDynamic: required }, revalidateLogic()],
    ["checked on submit", { onSubmit: required }, undefined],
  ];

  it.each(forms)("stays when the field is left as it is, in a form %s", async (_, rules, logic) => {
    const { form, field, errors } = formWith(rules, logic);
    const name = field("name");
    const phone = field("phone", { onChange: lenient });
    await form.handleSubmit();

    name.handleBlur();
    phone.handleBlur();

    expect(errors()).toEqual({ name: ["name required"], phone: ["phone required"] });
  });

  it.each(forms)(
    "goes when the value is accepted and comes back when it is refused again, in a form %s",
    async (_, rules, logic) => {
      const { form, field, errors } = formWith(rules, logic);
      const name = field("name");
      field("phone");
      await form.handleSubmit();

      name.handleChange("An");
      expect(errors()).toEqual({ phone: ["phone required"] });
      name.handleBlur();
      expect(errors()).toEqual({ phone: ["phone required"] });

      name.handleChange("");
      expect(errors()).toEqual({ name: ["name required"], phone: ["phone required"] });
    },
  );

  it("stays on a field refused by its own submit rule, until that rule accepts the value", async () => {
    const { form, seen, field, errors } = formWith({ onDynamic: required }, revalidateLogic());
    field("name").handleChange("An");
    const phone = field("phone", {
      onSubmit: ({ value }: { value: string }) => (value === "0000" ? "not a number" : undefined),
    });
    phone.handleChange("0000");
    await form.handleSubmit();

    phone.handleBlur();
    expect(errors()).toEqual({ phone: ["not a number"] });

    phone.handleChange("0912");
    expect(errors()).toEqual({});
    await form.handleSubmit();
    expect(seen.submitted).toBe(1);
  });

  it("is not looked for before the first submit", () => {
    const { field, errors } = formWith({ onSubmit: required }, undefined);
    const name = field("name");

    name.handleChange("An");
    name.handleChange("");
    name.handleBlur();

    expect(errors()).toEqual({});
  });

  it("stays on a row of a list when a field of the row is left", async () => {
    const { form, field, errors } = formWith({ onSubmit: required }, undefined);
    field("name").handleChange("An");
    field("phone").handleChange("0912");
    field("rows").pushValue({ title: "" });
    const title = field("rows[0].title");
    await form.handleSubmit();

    title.handleBlur();
    expect(errors()).toEqual({ "rows[0].title": ["title required"] });

    title.handleChange("First");
    expect(errors()).toEqual({});
  });
});
