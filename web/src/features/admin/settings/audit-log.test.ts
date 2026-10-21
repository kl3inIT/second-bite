import { describe, expect, it } from "vitest";

import { listSearch } from "../list-query";
import {
  type AuditEntry,
  appendAuditPage,
  auditActionLooks,
  auditActions,
  auditDefaults,
  auditResourceHref,
  readAuditQuery,
} from "./audit-log";

function entry(id: string, occurredAt: string): AuditEntry {
  return {
    id,
    occurredAt,
    actor: { id: "a1", label: "quantri@example.com" },
    action: "store.approve",
    resource: { type: "store", id: "s1", label: "Phở bò Gánh" },
    requestId: `req-${id}`,
  };
}

describe("the audit log's filters", () => {
  it("read an action of the catalog and well-formed days from the address", () => {
    expect(readAuditQuery({})).toEqual(auditDefaults);
    expect(
      readAuditQuery({ action: "store.block", from: "2026-10-14", to: ["2026-10-21", "x"] }),
    ).toEqual({ action: "store.block", from: "2026-10-14", to: "2026-10-21" });
    expect(readAuditQuery({ action: "sellerBlocked", from: "14/10", to: "2026-1-2" })).toEqual(
      auditDefaults,
    );
  });

  it("write back to the address without their defaults", () => {
    expect(listSearch(auditDefaults, {}, auditDefaults)).toBe("");
    expect(listSearch(auditDefaults, { action: "admin.revoke" }, auditDefaults)).toBe(
      "?action=admin.revoke",
    );
    expect(
      listSearch(
        { action: "admin.revoke", from: "2026-10-14", to: "2026-10-21" },
        { action: "all" },
        auditDefaults,
      ),
    ).toBe("?from=2026-10-14&to=2026-10-21");
  });
});

describe("the catalog of actions", () => {
  it("is subject.verb, each with its own words, tone and icon", () => {
    for (const action of auditActions) expect(action).toMatch(/^[a-z_]+\.[a-z]+$/);
    expect(new Set(auditActions.map((action) => auditActionLooks[action].key)).size).toBe(
      auditActions.length,
    );
    expect(auditActionLooks["store.block"].tone).toBe("error");
    expect(auditActionLooks["store.reject"].tone).toBe("neutral");
    expect(auditActionLooks["store.approve"].tone).toBe("success");
    expect(auditActionLooks["store.unblock"].tone).toBe("success");
    expect(auditActionLooks["offer_settings.change"].tone).toBe("info");
    expect(auditActionLooks["admin.grant"].tone).toBe("info");
    expect(auditActionLooks["admin.revoke"].tone).toBe("neutral");
  });

  it("opens each resource's page", () => {
    expect(auditResourceHref({ type: "store", id: "s1", label: "Phở bò Gánh" })).toBe(
      "/admin/sellers/s1",
    );
    expect(auditResourceHref({ type: "offer_settings", id: "offer", label: null })).toBe(
      "/admin/settings/offers",
    );
    expect(auditResourceHref({ type: "email_settings", id: "email", label: null })).toBe(
      "/admin/settings/email",
    );
    expect(auditResourceHref({ type: "admin", id: "a2", label: "ngocmai@example.com" })).toBe(
      "/admin/settings/admins",
    );
  });
});

describe("loading more of the log", () => {
  it("adds the next page under the rows shown, without repeating one", () => {
    const shown = [entry("e2", "2026-10-21T03:05:00Z"), entry("e1", "2026-10-21T02:58:00Z")];
    const next = { occurredAt: "2026-10-20T01:00:00Z", id: "e0" };
    const page = appendAuditPage(shown, {
      items: [entry("e1", "2026-10-21T02:58:00Z"), entry("e0", "2026-10-20T01:00:00Z")],
      next,
    });
    expect(page.items.map((each) => each.id)).toEqual(["e2", "e1", "e0"]);
    expect(page.next).toEqual(next);
  });

  it("stops when the last page has no cursor", () => {
    expect(appendAuditPage([], { items: [], next: null })).toEqual({ items: [], next: null });
  });
});
