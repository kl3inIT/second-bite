import { Suspense } from "react";

import { AdminPageGate, adminMetadata } from "@/features/admin/admin-page";
import { OrderDetailPage } from "@/features/admin/orders/order-detail-page";
import { getAdminOrder } from "@/features/admin/orders/orders-source";

export async function generateMetadata({ params }: PageProps<"/[locale]/admin/orders/[orderId]">) {
  const order = await getAdminOrder((await params).orderId);
  return adminMetadata(params, order ? { title: `#${order.code}` } : "orders");
}

// One order (SEC-62, Figma AD-DH3): built in full, not found until SEC-15 gives the admin its orders.
export default function AdminOrder({ params }: PageProps<"/[locale]/admin/orders/[orderId]">) {
  return (
    <AdminPageGate page="orderDetail">
      <Suspense fallback={null}>
        <OrderDetailPage params={params} />
      </Suspense>
    </AdminPageGate>
  );
}
