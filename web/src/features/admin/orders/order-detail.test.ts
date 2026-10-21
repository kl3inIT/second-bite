import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";

import { CancelOrderFields } from "./cancel-order-dialog";
import { OrderDetail } from "./order-detail";
import { renderAdmin, textOf } from "../testing/render";
import { sampleExpiredOrder, sampleOrder } from "./test-samples";

vi.mock("@/i18n/navigation", async () => {
  const { createElement: h } = await import("react");
  return {
    Link: ({ href, scroll: _scroll, ...props }: { href: string; scroll?: boolean }) =>
      h("a", { href, ...props }),
    useRouter: () => ({ push: () => {}, replace: () => {} }),
    usePathname: () => "/admin/orders/o-24817",
  };
});

function detail(props: Parameters<typeof OrderDetail>[0]) {
  return renderAdmin(createElement(OrderDetail, props));
}

describe("an order's page (AD-DH3)", () => {
  // 20:52 in Vietnam: 38 minutes before the window closes at 21:30.
  const now = new Date("2026-10-20T13:52:00Z");

  it("heads the page with the code, the state and its actions", () => {
    const html = detail({ order: sampleOrder, now });
    expect(html).toMatch(/<h1[^>]*>#SB-24817<\/h1>/);
    const text = textOf(html);
    expect(text).toContain("#SB-24817 Sẵn sàng");
    expect(text).toContain("Xem cửa hàng");
    expect(html).toContain('href="/admin/sellers/s-hoian"');
    expect(text).toContain("Huỷ đơn");
    expect(text).not.toContain("Ghi nhận vi phạm");
  });

  it("shows the strip: total to collect, portions, window and the time left", () => {
    const text = textOf(detail({ order: sampleOrder, now }));
    expect(text).toContain("Tổng thu tại quầy 50.000đ");
    expect(text).toContain("Số phần 2");
    expect(text).toContain("Khung nhận 20/10/2026 20:30–21:30");
    expect(text).toContain("Giữ hàng đến 21:30 Còn 38 phút");
  });

  it("lists the items, how to pay and the history with the step to come", () => {
    const text = textOf(detail({ order: sampleOrder, now }));
    expect(text).toContain("Bánh mì thập cẩm 50.000đ 90.000đ Giá gốc 90.000đ 2 phần");
    expect(text).toContain("Cách trả Tiền mặt hoặc VietQR của cửa hàng, khi nhận");
    expect(text).toContain("Khách đặt món 19:52, 20/10/2026");
    expect(text).toContain("Cửa hàng báo sẵn sàng 20:24, 20/10/2026");
    expect(text).toContain("Chờ khách nhận bằng mã 21:30, 20/10/2026");
  });

  it("gives the customer, the store and the pickup cards", () => {
    const text = textOf(detail({ order: sampleOrder, now }));
    expect(text).toContain("Tên Ngọc Mai");
    expect(text).toContain("Số điện thoại 0900 000 127");
    expect(text).toContain("Email ngoc.mai@example.com");
    expect(text).toContain("Đơn trước đó 5 đã nhận · 0 không đến");
    expect(text).toContain("Vị trí Tầng 1, Tasco Mall");
    expect(text).toContain("Trạng thái cửa hàng Đang hoạt động");
    expect(text).toContain("Thanh toán Trả tại quầy · chưa thu");
    expect(text).toContain("Mã nhận 4 số · chỉ khách thấy");
    expect(text).toContain("Nhập sai mã 0/3 lần");
  });

  it("says a no-show plainly, with nothing collected, and locks the record until SEC-15 (AD-DH5)", () => {
    const html = detail({ order: sampleExpiredOrder, now });
    const text = textOf(html);
    expect(text).toContain("#SB-24824 Hết hạn");
    expect(text).toContain("Tổng tiền (không thu) 30.000đ");
    expect(text).toContain("Hết hạn lúc 20:31 Đã hết giờ");
    expect(text).toContain(
      "Khách không đến nhận Không thu tiền, phần không bán lại Lần thứ 2 trong 30 ngày của khách Có thể ghi nhận vi phạm",
    );
    expect(text).toContain("Hết hạn · khách không đến");
    expect(text).toContain("Thanh toán Không thu tiền");
    expect(text).toContain("Mã nhận Đã hết hiệu lực");
    expect(text).not.toContain("Huỷ đơn");
    expect(html).toMatch(/<button[^>]*disabled=""[^>]*>Ghi nhận vi phạm/);
  });
});

describe("the cancel dialog's fields (AD-DH4)", () => {
  it("offers three reasons, required, and the note for the customer and the store", () => {
    const html = renderAdmin(
      createElement(CancelOrderFields, {
        reason: "sellerOutOfStock",
        onReason: () => {},
        note: "",
        onNote: () => {},
      }),
    );
    const text = textOf(html);
    expect(text).toContain("Lý do huỷ (bắt buộc)");
    expect(text).toContain("Cửa hàng hết hàng hoặc món không còn đạt");
    expect(text).toContain("Khách yêu cầu huỷ qua hỗ trợ");
    expect(text).toContain("Lý do khác");
    expect(text).toContain("Ghi chú cho khách và cửa hàng");
    expect(html.match(/type="radio"/g)).toHaveLength(3);
    expect(html).toMatch(/checked="" value="sellerOutOfStock"/);
    expect(html).not.toMatch(/<textarea[^>]*required/);
  });

  it("asks for the note when the reason is another one", () => {
    const html = renderAdmin(
      createElement(CancelOrderFields, {
        reason: "other",
        onReason: () => {},
        note: "",
        onNote: () => {},
      }),
    );
    expect(html).toMatch(/<textarea[^>]*required/);
  });
});
