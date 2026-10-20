import type {
  AdminRefund,
  AdminRefundRow,
  AdminTransaction,
  AdminTransactionRow,
  RefundStatus,
  TransactionStatus,
} from "./payment";

// Sample payments and refunds for the unit tests only, as Figma AD-HT1 to AD-HT4 draw them (phones
// 0900 000 1xx, addresses @example.com). No running code imports this file.

const sellers = ["Tiệm bánh Pháp", "Cơm nhà Hạnh", "Trà sữa Mây", "Bún chả Phố Hàng"];
const transactionStates: TransactionStatus[] = [
  "confirmed",
  "confirmed",
  "awaitingSepay",
  "mismatch",
  "confirmed",
  "confirmed",
  "confirmed",
  "awaitingSepay",
  "mismatch",
  "confirmed",
  "confirmed",
];

/** Eleven transactions, GD-1048 the latest (21:14 on 20/10 in Vietnam), one a minute earlier each. */
export const sampleTransactions: AdminTransactionRow[] = transactionStates.map((status, n) => ({
  id: `t-${n}`,
  code: `GD-${1048 - n}`,
  orderId: `o-${n}`,
  orderCode: `SB-${2041 - n}`,
  sellerName: sellers[n % sellers.length],
  customerName: n === 0 ? "Minh Anh" : `Khách ${n}`,
  amountVnd: 20_000 + n * 3_000,
  method: n % 2 === 0 ? "vietqr" : "cash",
  status,
  at: new Date(Date.UTC(2026, 9, 20, 14, 14 - n)).toISOString(),
}));

/** GD-1045: 40.000đ received for an order of 45.000đ (AD-HT2). */
export const sampleMismatch: AdminTransaction = {
  id: "t-1045",
  code: "GD-1045",
  orderId: "o-2038",
  orderCode: "SB-2038",
  sellerName: "Bún chả Phố Hàng",
  customerName: "Đức Long",
  customerPhone: "0900 000 135",
  amountVnd: 40_000,
  method: "vietqr",
  status: "mismatch",
  at: "2026-10-20T13:51:00Z",
  orderAmountVnd: 45_000,
  orderStatus: "confirmed",
  orderPickupEnd: "2026-10-20T14:20:00Z",
  sepay: {
    reference: "SP-FT26293-0001845",
    content: "SB2038",
    bank: "MB Bank",
    accountLast4: "6789",
    receivedVnd: 40_000,
  },
  history: [
    { kind: "orderPlaced", at: "2026-10-20T13:47:00Z" },
    { kind: "qrCreated", at: "2026-10-20T13:49:00Z", amountVnd: 45_000 },
    { kind: "sepayReceived", at: "2026-10-20T13:51:00Z", amountVnd: 40_000 },
    { kind: "flaggedMismatch", at: "2026-10-20T13:51:00Z" },
  ],
};

const refundStates: RefundStatus[] = [
  "pending",
  "pending",
  "pending",
  "pending",
  "approved",
  "rejected",
  "approved",
  "approved",
  "rejected",
  "approved",
  "approved",
  "pending",
];

/** Twelve requests, HT-0312 the latest (21:05 on 20/10 in Vietnam). */
export const sampleRefunds: AdminRefundRow[] = refundStates.map((status, n) => ({
  id: `r-${n}`,
  code: `HT-0${312 - n}`,
  orderId: `o-${n}`,
  orderCode: `SB-${2029 - n * 2}`,
  sellerName: sellers[(n + 3) % sellers.length],
  customerName: n === 0 ? "Đức Long" : `Khách ${n}`,
  amountVnd: 45_000 - n * 1_000,
  reason: n === 0 ? "Món nguội, thiếu chả so với ảnh trên app" : "Bánh bị móp",
  status,
  requestedAt: new Date(Date.UTC(2026, 9, 20, 14, 5 - n * 20)).toISOString(),
}));

/** HT-0312, waiting, with three photos and the store's view (AD-HT4). */
export const sampleRefund: AdminRefund = {
  ...sampleRefunds[0],
  method: "vietqr",
  transactionCode: "GD-1031",
  transactionStatus: "confirmed",
  orderAmountVnd: 45_000,
  photoUrls: ["/photos/1.jpg", "/photos/2.jpg", "/photos/3.jpg"],
  sellerResponse: {
    text: "Chả nướng lúc 20:00, khách đến sau nên có thể đã nguội.",
    by: "chu.cuahang@example.com",
    at: "2026-10-20T14:30:00Z",
  },
  history: [
    { kind: "orderPlaced", at: "2026-10-20T13:47:00Z" },
    { kind: "paymentConfirmed", at: "2026-10-20T13:56:00Z" },
    { kind: "requested", at: "2026-10-20T14:05:00Z", photos: 3 },
    { kind: "sellerResponded", at: "2026-10-20T14:30:00Z" },
  ],
};
