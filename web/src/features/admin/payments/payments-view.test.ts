import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";

import { renderAdmin, textOf } from "../testing/render";
import { ApproveRefundFields, RejectRefundFields } from "./refund-dialogs";
import { RefundDetails } from "./refund-sheet";
import { RefundsView } from "./refunds-view";
import { sampleMismatch, sampleRefund, sampleRefunds, sampleTransactions } from "./test-samples";
import { TransactionDetails } from "./transaction-sheet";
import { TransactionsView } from "./transactions-view";

vi.mock("@/i18n/navigation", async () => {
  const { createElement: h } = await import("react");
  return {
    Link: ({ href, scroll: _scroll, ...props }: { href: string; scroll?: boolean }) =>
      h("a", { href, ...props }),
    useRouter: () => ({ push: () => {}, replace: () => {} }),
    usePathname: () => "/admin/payments",
  };
});

describe("the transactions tab (AD-HT1)", () => {
  it("shows the empty state and no figures without transactions, as the page does until SEC-18", () => {
    const text = textOf(renderAdmin(createElement(TransactionsView, { rows: [], status: "all" })));
    expect(text).toContain("Chưa có giao dịch nào");
    expect(text).toContain("Đã xác nhận —");
    expect(text).toContain("Không khớp —");
  });

  it("draws the cards, the filters and the rows from sample transactions", () => {
    const html = renderAdmin(
      createElement(TransactionsView, {
        rows: sampleTransactions,
        summary: { confirmed: 46, awaitingSepay: 3, mismatch: 2 },
        status: "all",
      }),
    );
    const text = textOf(html);
    expect(text).toContain("Đã xác nhận 46");
    expect(text).toContain("Chờ SePay 3");
    expect(text).toContain("Phương thức: Tất cả");
    expect(html).toContain('placeholder="Tìm theo mã giao dịch, mã đơn hoặc cửa hàng"');
    expect(text).toContain(
      "GD-1048 #SB-2041 Tiệm bánh Pháp Minh Anh 20.000đ VietQR Đã xác nhận 21:14, 20/10",
    );
    expect(text).toContain("Tiền mặt");
    expect(text).toContain("Hiển thị 1–10 trên 11 giao dịch");
    expect(html).toContain('href="/admin/payments?transaction=t-0"');
    expect(html).toContain('href="/admin/orders/o-0"');
  });

  it("keeps the state from the address and marks its card", () => {
    const html = renderAdmin(
      createElement(TransactionsView, { rows: sampleTransactions, status: "mismatch" }),
    );
    expect(textOf(html)).toContain("Hiển thị 1–2 trên 2 giao dịch");
    expect(html).toContain('href="/admin/payments?status=mismatch&amp;transaction=t-3"');
  });
});

describe("a transaction's sheet (AD-HT2)", () => {
  it("says the mismatch in one line, then SePay's account, the order and the history", () => {
    const text = textOf(
      renderAdmin(createElement(TransactionDetails, { transaction: sampleMismatch })),
    );
    expect(text).toContain("Không khớp VietQR");
    expect(text).toContain("Số tiền chuyển không khớp đơn.");
    expect(text).toContain("Mã tham chiếu SePay SP-FT26293-0001845");
    expect(text).toContain("Tài khoản nhận (của cửa hàng) MB Bank · ****6789");
    expect(text).toContain("Số tiền đơn 45.000đ Số tiền nhận 40.000đ Chênh lệch Thiếu 5.000đ");
    expect(text).toContain("Mã đơn #SB-2038");
    expect(text).toContain("Khách Đức Long · 0900 000 135");
    expect(text).toContain("Trạng thái đơn Đã xác nhận, giữ đến 21:20");
    expect(text).toContain("Khách đặt giữ đơn #SB-2038, chọn trả bằng VietQR 20:47, 20/10/2026");
    expect(text).toContain("SePay báo nhận 40.000đ");
    expect(text).toContain("Hệ thống đánh dấu Không khớp và báo quản trị viên");
  });
});

describe("the refunds tab (AD-HT3)", () => {
  it("shows the empty state without requests", () => {
    const text = textOf(renderAdmin(createElement(RefundsView, { rows: [], status: "all" })));
    expect(text).toContain("Chưa có yêu cầu hoàn tiền nào");
    expect(text).toContain("Chờ duyệt —");
  });

  it("draws the cards and the rows from sample requests", () => {
    const html = renderAdmin(
      createElement(RefundsView, {
        rows: sampleRefunds,
        summary: { approved7Days: 12, pending: 4, rejected7Days: 3 },
        status: "all",
      }),
    );
    const text = textOf(html);
    expect(text).toContain("Đã duyệt (7 ngày) 12");
    expect(text).toContain("Từ chối (7 ngày) 3");
    expect(text).toContain(
      "HT-0312 #SB-2029 Bún chả Phố Hàng Đức Long 45.000đ Món nguội, thiếu chả so với ảnh trên app Chờ duyệt 21:05, 20/10",
    );
    expect(text).toContain("Từ chối");
    expect(text).toContain("Hiển thị 1–10 trên 12 yêu cầu");
    expect(html).toContain('href="/admin/payments?tab=refunds&amp;refund=r-0"');
    expect(html).toContain('href="/admin/payments?tab=refunds&amp;status=pending"');
  });
});

describe("a refund request's sheet (AD-HT4 to AD-HT6)", () => {
  it("says the customer paid the store, then the request, the store's view and the history", () => {
    const html = renderAdmin(createElement(RefundDetails, { refund: sampleRefund }));
    const text = textOf(html);
    expect(text).toContain("Chờ duyệt VietQR");
    expect(text).toContain("Tiền khách đã trả thẳng cho cửa hàng.");
    expect(text).toContain("Thanh toán VietQR · GD-1031 · đã xác nhận");
    expect(text).toContain("Khách đề nghị hoàn 45.000đ");
    expect(text).toContain("“Món nguội, thiếu chả so với ảnh trên app”");
    expect(html.match(/alt="Ảnh \d của khách"/g)).toHaveLength(3);
    expect(text).toContain("Người phản hồi chu.cuahang@example.com");
    expect(text).toContain("Khách gửi yêu cầu hoàn tiền kèm 3 ảnh");
    expect(text).toContain("Cửa hàng gửi ý kiến, chờ quản trị viên quyết định");
  });

  it("asks the amount, the way and a note to approve", () => {
    const html = renderAdmin(
      createElement(ApproveRefundFields, {
        request: { amountVnd: 45_000, way: "atCounter", note: "" },
        orderAmountVnd: 45_000,
        onChange: () => {},
      }),
    );
    const text = textOf(html);
    expect(text).toContain("Số tiền hoàn");
    expect(html).toContain('value="45000"');
    expect(text).toContain("Cửa hàng hoàn tại quầy");
    expect(text).toContain("Cửa hàng chuyển khoản");
    expect(text).toContain("Ghi chú cho khách");
  });

  it("asks a required reason to refuse", () => {
    const html = renderAdmin(createElement(RejectRefundFields, { reason: "", onReason: () => {} }));
    expect(textOf(html)).toContain("Lý do từ chối (bắt buộc)");
    expect(html).toMatch(/<textarea[^>]*required/);
  });
});
