import { describe, expect, it } from "vitest";

import { fieldIdOf, fieldIds } from "./field-ids";

// The form ids are the ones React 19 gives: `_r_1_` in the browser, `_R_1ab_` from the server.
describe("the ids of a field", () => {
  it("start with the form's id, so the same field in two forms has two ids", () => {
    const page = fieldIds({ name: "email", form: { formId: "_R_2n_" } });
    const dialog = fieldIds({ name: "email", form: { formId: "_r_5_" } });

    expect(page).toEqual({
      control: "_R_2n_-email",
      hint: "_R_2n_-email-hint",
      error: "_R_2n_-email-error",
    });
    expect(Object.values(dialog).filter((id) => Object.values(page).includes(id))).toEqual([]);
  });

  it("hold no space, which would end the id in aria-describedby", () => {
    const ids = fieldIds({ name: "projects[0].title", form: { formId: "_r_1_" } });

    expect(Object.values(ids).every((id) => !/\s/.test(id))).toBe(true);
    expect(ids.control).toBe(fieldIdOf({ formId: "_r_1_" }, "projects[0].title"));
  });
});
