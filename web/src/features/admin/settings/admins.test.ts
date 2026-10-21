import { describe, expect, it } from "vitest";

import { type AdminGrant, addAdminProblem, revokeBlock, sameEmail } from "./admins";

function admin(email: string, status: AdminGrant["status"] = "active"): AdminGrant {
  return {
    accountId: email,
    email,
    grantedAt: "2026-10-01T02:00:00Z",
    grantedBy: null,
    status,
  };
}

describe("who can be revoked", () => {
  const me = admin("quantri@example.com");
  const other = admin("ngocmai@example.com");
  const waiting = admin("lanchi@example.com", "pending");

  it("is never the viewer, whatever the case of their address", () => {
    expect(revokeBlock(me, [me, other], "QuanTri@Example.com ")).toBe("self");
  });

  it("is another admin while one active admin remains", () => {
    expect(revokeBlock(other, [me, other, waiting], me.email)).toBeNull();
    expect(revokeBlock(waiting, [me, other, waiting], me.email)).toBeNull();
  });

  it("is never the last active admin; one waiting to sign in does not count", () => {
    expect(revokeBlock(other, [other, waiting], undefined)).toBe("lastAdmin");
    expect(revokeBlock(waiting, [other, waiting], undefined)).toBeNull();
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
