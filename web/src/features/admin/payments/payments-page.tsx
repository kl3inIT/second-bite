import { getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@/i18n/navigation";

import { adminHref } from "../pages";
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
 * then the open tab's list; `?transaction=` or `?refund=` opens one in the side sheet. Each tab is an address, so
 * it can be shared and the back button returns to it. Empty until SEC-18.
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
      <h1 className="text-page-title text-foreground">{pages("label")}</h1>
      <Tabs value={tab}>
        <TabsList variant="line" aria-label={t("label")}>
          <TabsTrigger
            value="transactions"
            nativeButton={false}
            render={<Link href={list} scroll={false} />}
          >
            {t("transactions")}
          </TabsTrigger>
          <TabsTrigger
            value="refunds"
            nativeButton={false}
            render={<Link href={`${list}?tab=refunds`} scroll={false} />}
          >
            {t("refunds")}
            {refunds.summary?.pending !== undefined && (
              <Badge variant="secondary">{refunds.summary.pending}</Badge>
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value={tab}>
          <div className="flex flex-col gap-5">
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
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
