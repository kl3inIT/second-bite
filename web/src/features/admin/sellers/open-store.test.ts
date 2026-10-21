import { describe, expect, it } from "vitest";

import {
  addressOf,
  isEmail,
  isPhone,
  NAME_MAX,
  openStoreProblems,
  problemOfFailure,
} from "./open-store";

const draft = {
  name: "Tiệm bánh Pháp",
  phone: "0900 000 101",
  floor: "Tầng 1",
  ownerEmail: "chu.tiembanh@example.com",
};

describe("opening a store for its owner (AD-OS2, AD-OS4)", () => {
  it("writes the address as the floor of Tasco Mall", () => {
    expect(addressOf("Tầng 1")).toBe("Tầng 1, Tasco Mall, Việt Hưng, Long Biên");
  });

  it("finds nothing wrong with a filled form", () => {
    expect(openStoreProblems(draft)).toEqual({});
  });

  it("asks for a name of at most a hundred characters", () => {
    expect(openStoreProblems({ ...draft, name: "  " }).name).toBe("nameRequired");
    expect(openStoreProblems({ ...draft, name: "a".repeat(NAME_MAX) }).name).toBeUndefined();
    expect(openStoreProblems({ ...draft, name: "a".repeat(NAME_MAX + 1) }).name).toBe(
      "nameTooLong",
    );
  });

  it("reads a phone as the seller module does: 9 to 15 digits, with spaces, dots and dashes", () => {
    expect(isPhone("0900 000 101")).toBe(true);
    expect(isPhone("+84 900-000.101")).toBe(true);
    expect(isPhone("(024) 3900 0101")).toBe(true);
    expect(isPhone("0900 00")).toBe(false);
    expect(isPhone("0900 000 101 0000 0")).toBe(true);
    expect(isPhone("0900 000 101 0000 00")).toBe(false);
    expect(isPhone("0900 abc 101")).toBe(false);
    expect(isPhone("09+00 000 101")).toBe(false);
    expect(openStoreProblems({ ...draft, phone: "" }).phone).toBe("phoneInvalid");
  });

  it("asks for an owner's email that can receive mail", () => {
    expect(isEmail("chu.tiembanh@example.com")).toBe(true);
    expect(isEmail(" chu@example.com ")).toBe(true);
    expect(isEmail("chu.tiembanh")).toBe(false);
    expect(isEmail("chu tiem@example.com")).toBe(false);
    expect(isEmail("chu@example")).toBe(false);
    expect(isEmail(`${"a".repeat(250)}@example.com`)).toBe(false);
    expect(openStoreProblems({ ...draft, ownerEmail: "" }).ownerEmail).toBe("emailInvalid");
  });

  it("puts a refusal of the backend on its field", () => {
    expect(problemOfFailure("SELLER_LIMIT_REACHED")).toEqual({
      field: "ownerEmail",
      problem: "ownerLimit",
    });
    expect(problemOfFailure("SELLER_PHONE_INVALID")).toEqual({
      field: "phone",
      problem: "phoneInvalid",
    });
    expect(problemOfFailure("SELLER_OWNER_EMAIL_INVALID")?.field).toBe("ownerEmail");
    expect(problemOfFailure("INTERNAL")).toBeUndefined();
    expect(problemOfFailure(undefined)).toBeUndefined();
  });
});
