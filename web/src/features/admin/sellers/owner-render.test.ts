import { createElement } from "react";
import { describe, expect, test, vi } from "vitest";

import { navigationMock, renderAdmin, textOf } from "../testing/render";
import type { AdminMember } from "./member";
import { OpenStoreButton, OpenStoreFields } from "./open-store-sheet";
import { SellerMembers } from "./seller-members";

// An admin opening a store for its owner (SEC-64, Figma AD-OS1 to AD-OS4), behind the `openForOwner` flag: the
// screens with sample data, since `POST /admin/sellers` does not exist yet. The sheet is a portal, which does not
// render on the server, so its fields are rendered on their own.
vi.mock("@/i18n/navigation", () => ({
  ...navigationMock,
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
}));

const draft = {
  name: "Tiệm bánh Pháp",
  phone: "0900 000 101",
  floor: "Tầng 1",
  ownerEmail: "chu.tiembanh@example.com",
};

const fields = {
  draft,
  problems: {},
  onChange: () => {},
  onLeave: () => {},
  onPhoto: () => {},
};

describe("opening a store for its owner", () => {
  test("offers 'Mở cửa hàng' on the list's header (AD-OS1)", () => {
    const html = renderAdmin(createElement(OpenStoreButton));
    expect(textOf(html)).toBe("Mở cửa hàng");
  });

  test("asks for the name, the phone, the floor of Tasco Mall, a photo and the owner's email (AD-OS2)", () => {
    const html = renderAdmin(createElement(OpenStoreFields, fields));
    const text = textOf(html);
    for (const label of [
      "Tên cửa hàng",
      "Số điện thoại",
      "Địa chỉ",
      "Tầng:",
      "Ảnh cửa hàng",
      "Chọn ảnh",
      "Email chủ cửa hàng",
    ]) {
      expect(text).toContain(label);
    }
    expect(html).toContain('value="Tiệm bánh Pháp"');
    expect(html).toContain('type="tel"');
    expect(html).toContain('type="email"');
    expect(html).toContain('value="chu.tiembanh@example.com"');
    expect(html).toContain("Tầng 1");
    const mall = /<input[^>]*value="Tasco Mall, Việt Hưng, Long Biên"[^>]*>/.exec(html)?.[0];
    expect(mall).toContain("disabled");
    expect(html).toContain('accept="image/jpeg,image/png,image/webp"');
    expect(html).not.toContain('aria-invalid="true"');
  });

  test("says what is wrong at its field, such as an owner of five stores already (AD-OS4)", () => {
    const html = renderAdmin(
      createElement(OpenStoreFields, {
        ...fields,
        problems: { name: "nameRequired", phone: "phoneInvalid", ownerEmail: "ownerLimit" },
        photoUrl: "blob:photo",
      }),
    );
    const text = textOf(html);
    expect(text).toContain("Nhập tên cửa hàng");
    expect(text).toContain("Nhập số điện thoại 9 đến 15 chữ số");
    expect(text).toContain("Email này đã là chủ của 5 cửa hàng");
    expect(text).toContain("Đổi ảnh");
    expect(html.match(/aria-invalid="true"/g)).toHaveLength(3);
    expect(html).toMatch(/aria-describedby="[^"]*-email-problem"/);
  });
});

const owner: AdminMember = {
  accountId: "acc-1",
  email: "chu.tiembanh@example.com",
  role: "owner",
  addedAt: "2026-10-21T02:00:00Z",
};

describe("the owner of a store an admin opened (AD-OS3)", () => {
  test("waits for sign-in until the owner's address signs in", () => {
    const waiting = textOf(
      renderAdmin(createElement(SellerMembers, { members: [{ ...owner, awaitingSignIn: true }] })),
    );
    expect(waiting).toContain("Chờ đăng nhập");
    expect(waiting).toContain("Chủ cửa hàng");

    const signedIn = textOf(renderAdmin(createElement(SellerMembers, { members: [owner] })));
    expect(signedIn).not.toContain("Chờ đăng nhập");
  });
});
