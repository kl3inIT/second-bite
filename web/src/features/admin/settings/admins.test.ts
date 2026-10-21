import { describe, expect, it } from "vitest";

import type { AccountBody } from "@/lib/api/generated";

import { addAdminProblem, adminRefusal, revokeBlock, sameEmail } from "./admins";

function admin(email: string): AccountBody {
  return { id: email, email, displayName: "", role: "admin" };
}

describe("who can be revoked", () => {
  const me = admin("quantri@example.com");
  const other = admin("ngocmai@example.com");

  it("is never the viewer, whatever the case of their address", () => {
    expect(revokeBlock(me, [me, other], "QuanTri@Example.com ")).toBe("self");
  });

  it("is another admin while one admin remains", () => {
    expect(revokeBlock(other, [me, other], me.email)).toBeNull();
  });

  it("is never the last admin", () => {
    expect(revokeBlock(other, [other], undefined)).toBe("lastAdmin");
  });

  it("names the viewer before the last admin", () => {
    expect(revokeBlock(me, [me], me.email)).toBe("self");
  });
});

describe("an address to add as an admin", () => {
  const admins = [admin("quantri@example.com")];

  it("is an address", () => {
    expect(addAdminProblem("baotran@example.com", admins)).toBeNull();
    expect(addAdminProblem("  baotran@example.com ", admins)).toBeNull();
    expect(addAdminProblem("bao.tran+admin@mail.example.com", admins)).toBeNull();
    for (const wrong of [
      "baotran",
      "baotran@",
      "@example.com",
      "bao tran@example.com",
      "a@b",
      "a@@b.com",
    ]) {
      expect(addAdminProblem(wrong, admins), wrong).toBe("invalid");
    }
    expect(addAdminProblem(`${"a".repeat(250)}@example.com`, admins)).toBe("invalid");
  });

  it("is not an admin already", () => {
    expect(addAdminProblem("QUANTRI@example.com", admins)).toBe("taken");
  });

  it("compares addresses without case or spaces", () => {
    expect(sameEmail(" A@Example.com", "a@example.com")).toBe(true);
    expect(sameEmail("a@example.com", "b@example.com")).toBe(false);
  });
});

describe("a refused grant or revoke", () => {
  it("is worded from the backend's code, and any other failure says to try again", () => {
    expect(adminRefusal("IDENTITY_LAST_ADMIN")).toBe("lastAdmin");
    expect(adminRefusal("IDENTITY_ADDRESS_UNPROVEN")).toBe("unproven");
    expect(adminRefusal("PLATFORM_INTERNAL_FAILURE")).toBe("failed");
    expect(adminRefusal(undefined)).toBe("failed");
  });
});
