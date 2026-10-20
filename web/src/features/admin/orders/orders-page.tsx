import { getTranslations } from "next-intl/server";

import { PageHeader } from "../ui/page-header";
import { orderSearch, orderStatusFilter } from "./order";
import { listAdminOrders } from "./orders-source";
import { OrdersView } from "./orders-view";

/** Đơn hàng (Figma AD-DH1): the heading, then the list, empty until SEC-15. */
export async function OrdersPage({
  query,
}: {
  query: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ status, q }, t, orders] = await Promise.all([
    query,
    getTranslations("admin.shell.pages.orders"),
    listAdminOrders(),
  ]);

  return (
    <>
      <PageHeader title={t("label")} />
      <OrdersView
        rows={orders.items}
        summary={orders.summary}
        status={orderStatusFilter(status)}
        search={orderSearch(q)}
      />
    </>
  );
}
