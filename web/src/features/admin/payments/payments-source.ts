import "server-only";

import type {
  AdminRefund,
  AdminRefundRow,
  AdminTransaction,
  AdminTransactionRow,
  RefundSummary,
  TransactionSummary,
} from "./payment";

// The admin's payments and refunds. SEC-18 has not built the `payment` module nor its admin API yet, so there
// are none and the page shows its empty states; each becomes an `adminRead` of the generated SDK then.

export async function listAdminTransactions(): Promise<{
  items: AdminTransactionRow[];
  summary?: TransactionSummary;
}> {
  return { items: [] };
}

export async function getAdminTransaction(_id: string): Promise<AdminTransaction | undefined> {
  return undefined;
}

export async function listAdminRefunds(): Promise<{
  items: AdminRefundRow[];
  summary?: RefundSummary;
}> {
  return { items: [] };
}

export async function getAdminRefund(_id: string): Promise<AdminRefund | undefined> {
  return undefined;
}
