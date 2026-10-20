import { getTranslations } from "next-intl/server";

import { adminHref } from "../pages";
import { PageHeader } from "../ui/page-header";
import { AdminTabs } from "../ui/tabs";
import { paymentsTab, refundStatuses, statusFilter, transactionStatuses } from "./payment";
import {
  getAdminRefund,
  getAdminTransaction,
  listAdminRefunds,
  listAdminTransactions,
} from "./payments-source";
import { RefundsView } from "./refunds-view";
import { TransactionsView } from "./transactions-view";

type Query = Record<string, string | string[] | undefined>;

const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

/**
 * Thanh toán & Hoàn tiền (Figma AD-HT1 to AD-HT7): the heading, the tabs Giao dịch | Hoàn tiền (`?tab=refunds`),
 * then the open tab's list; `?transaction=` or `?refund=` opens one in the side sheet. Empty until SEC-18.
 */
export async function PaymentsPage({ query }: { query: Promise<Query> }) {
  const [params, t, pages] = await Promise.all([
    query,
    getTranslations("admin.payments.tabs"),
    getTranslations("admin.shell.pages.payments"),
  ]);
  const tab = paymentsTab(params.tab);
  const [transactions, refunds] = await Promise.all([listAdminTransactions(), listAdminRefunds()]);
  const transactionId = one(params.transaction);
  const refundId = one(params.refund);
  const list = adminHref("payments");

  return (
    <>
      <PageHeader title={pages("label")} />
      <AdminTabs
        label={t("label")}
        current={tab}
        tabs={[
          { key: "transactions", label: t("transactions"), href: list },
          {
            key: "refunds",
            label: t("refunds"),
            href: `${list}?tab=refunds`,
            count: refunds.summary?.pending,
          },
        ]}
      />
      {tab === "transactions" ? (
        <TransactionsView
          rows={transactions.items}
          summary={transactions.summary}
          status={statusFilter(params.status, transactionStatuses)}
          selected={transactionId ? await getAdminTransaction(transactionId) : undefined}
        />
      ) : (
        <RefundsView
          rows={refunds.items}
          summary={refunds.summary}
          status={statusFilter(params.status, refundStatuses)}
          selected={refundId ? await getAdminRefund(refundId) : undefined}
        />
      )}
    </>
  );
}
