import { folded, inRange, type OrderStatus, type Sort } from "../orders/order";
import type { DateRangeValue } from "../ui/filter-bar";

// The admin's payments and refunds (SEC-62, Figma AD-HT1 to AD-HT7). SEC-18 has not built the `payment` module
// yet (roadmap: cash at the counter and VietQR transfers confirmed through SePay; refunds decided by admins),
// so these shapes follow Figma's tables and sheets. They are replaced by the generated SDK's types once SEC-18
// publishes its admin API; the screens keep their props. The customer pays the store directly (pilot), so a
// refund is the store's to hand back; the admin decides and records it.

export type PaymentMethod = "cash" | "vietqr";

export const paymentMethods: readonly PaymentMethod[] = ["vietqr", "cash"];

/** A payment's state: confirmed, a VietQR transfer SePay has not reported yet, or one whose amount differs. */
export type TransactionStatus = "confirmed" | "awaitingSepay" | "mismatch";

export const transactionStatuses: readonly TransactionStatus[] = [
  "confirmed",
  "awaitingSepay",
  "mismatch",
];

/** One row of the transactions table (AD-HT1). Times are ISO instants. */
export type AdminTransactionRow = {
  id: string;
  /** "GD-1048". */
  code: string;
  orderId: string;
  /** "SB-2041", shown with a "#". */
  orderCode: string;
  sellerName: string;
  customerName: string;
  amountVnd: number;
  method: PaymentMethod;
  status: TransactionStatus;
  at: string;
};

/** The figures over the transactions table; none until the backend counts them. */
export type TransactionSummary = { confirmed: number; awaitingSepay: number; mismatch: number };

export type TransactionEventKind =
  "orderPlaced" | "qrCreated" | "sepayReceived" | "cashCollected" | "confirmed" | "flaggedMismatch";

/** A transaction as its side sheet shows it (AD-HT2). */
export type AdminTransaction = AdminTransactionRow & {
  orderAmountVnd: number;
  customerPhone: string;
  orderStatus: OrderStatus;
  orderPickupEnd: string;
  /** What SePay reported for a VietQR transfer. */
  sepay?: {
    reference: string;
    content: string;
    bank: string;
    /** The last four digits of the store's account. */
    accountLast4: string;
    receivedVnd: number;
  };
  history: { kind: TransactionEventKind; at: string; amountVnd?: number }[];
};

export type RefundStatus = "pending" | "approved" | "rejected";

export const refundStatuses: readonly RefundStatus[] = ["pending", "approved", "rejected"];

/** One row of the refunds table (AD-HT3). */
export type AdminRefundRow = {
  id: string;
  /** "HT-0312". */
  code: string;
  orderId: string;
  orderCode: string;
  sellerName: string;
  customerName: string;
  /** What the customer asks back. */
  amountVnd: number;
  /** The customer's reason, in their words. */
  reason: string;
  status: RefundStatus;
  requestedAt: string;
};

/** The figures over the refunds table: decided in the last 7 days, and waiting. */
export type RefundSummary = { approved7Days: number; pending: number; rejected7Days: number };

export type RefundEventKind =
  "orderPlaced" | "paymentConfirmed" | "requested" | "sellerResponded" | "approved" | "rejected";

/** A refund request as its side sheet shows it (AD-HT4). */
export type AdminRefund = AdminRefundRow & {
  method: PaymentMethod;
  transactionCode?: string;
  transactionStatus?: TransactionStatus;
  orderAmountVnd: number;
  photoUrls: string[];
  sellerResponse?: { text: string; by: string; at: string };
  history: { kind: RefundEventKind; at: string; amountVnd?: number; photos?: number }[];
};

/** How the store hands the money back (AD-HT5). */
export type RefundWay = "atCounter" | "transfer";

export type ApproveRequest = { amountVnd: number; way: RefundWay; note: string };

/** A refund is approved for at least 1đ and at most what the order cost. */
export function canApprove(amountVnd: number, orderAmountVnd: number): boolean {
  return Number.isInteger(amountVnd) && amountVnd >= 1 && amountVnd <= orderAmountVnd;
}

/** A refusal says why: the customer reads it. */
export function canReject(reason: string): boolean {
  return reason.trim().length > 0;
}

/** What SePay received against what the order costs: short, over or matching. */
export function difference(
  receivedVnd: number,
  orderAmountVnd: number,
): { kind: "short" | "over" | "even"; amountVnd: number } {
  const delta = receivedVnd - orderAmountVnd;
  if (delta === 0) return { kind: "even", amountVnd: 0 };
  return { kind: delta < 0 ? "short" : "over", amountVnd: Math.abs(delta) };
}

/** Which tab of the page the address opens (`?tab=refunds`); the transactions by default. */
export type PaymentsTab = "transactions" | "refunds";

export function paymentsTab(value: string | string[] | undefined): PaymentsTab {
  return (Array.isArray(value) ? value[0] : value) === "refunds" ? "refunds" : "transactions";
}

/** The status filter of a tab from the address, which its cards link to; anything else is all. */
export function statusFilter<Status extends string>(
  value: string | string[] | undefined,
  statuses: readonly Status[],
): Status | "all" {
  const one = Array.isArray(value) ? value[0] : value;
  return statuses.includes(one as Status) ? (one as Status) : "all";
}

// The tables' search, filters and sort, in the browser until SEC-18's API takes them.

export type TransactionFilters = {
  search: string;
  method: PaymentMethod | "all";
  status: TransactionStatus | "all";
  range: DateRangeValue;
};

export function filterTransactions(
  rows: AdminTransactionRow[],
  filters: TransactionFilters,
): AdminTransactionRow[] {
  const needle = folded(filters.search.trim().replace(/^#/, ""));
  return rows.filter(
    (row) =>
      (filters.method === "all" || row.method === filters.method) &&
      (filters.status === "all" || row.status === filters.status) &&
      inRange(row.at, filters.range) &&
      (needle === "" ||
        [row.code, row.orderCode, row.sellerName].some((text) => folded(text).includes(needle))),
  );
}

export type TransactionSortKey = "seller" | "amount" | "at";

export function sortTransactions(
  rows: AdminTransactionRow[],
  sort: Sort<TransactionSortKey>,
): AdminTransactionRow[] {
  const sign = sort.direction === "asc" ? 1 : -1;
  return rows.toSorted((a, b) => {
    if (sort.key === "seller") return sign * a.sellerName.localeCompare(b.sellerName, "vi");
    if (sort.key === "amount") return sign * (a.amountVnd - b.amountVnd);
    return sign * a.at.localeCompare(b.at);
  });
}

export type RefundFilters = {
  search: string;
  status: RefundStatus | "all";
  seller: string;
  range: DateRangeValue;
};

export function filterRefunds(rows: AdminRefundRow[], filters: RefundFilters): AdminRefundRow[] {
  const needle = folded(filters.search.trim().replace(/^#/, ""));
  return rows.filter(
    (row) =>
      (filters.status === "all" || row.status === filters.status) &&
      (filters.seller === "all" || row.sellerName === filters.seller) &&
      inRange(row.requestedAt, filters.range) &&
      (needle === "" ||
        [row.code, row.orderCode, row.customerName].some((text) => folded(text).includes(needle))),
  );
}

export type RefundSortKey = "seller" | "amount" | "requestedAt";

export function sortRefunds(rows: AdminRefundRow[], sort: Sort<RefundSortKey>): AdminRefundRow[] {
  const sign = sort.direction === "asc" ? 1 : -1;
  return rows.toSorted((a, b) => {
    if (sort.key === "seller") return sign * a.sellerName.localeCompare(b.sellerName, "vi");
    if (sort.key === "amount") return sign * (a.amountVnd - b.amountVnd);
    return sign * a.requestedAt.localeCompare(b.requestedAt);
  });
}

/** The stores' names in the rows, once each, for the "Cửa hàng" filter. */
export function sellerNames(rows: { sellerName: string }[]): string[] {
  return [...new Set(rows.map((row) => row.sellerName))].toSorted((a, b) =>
    a.localeCompare(b, "vi"),
  );
}
