import { Suspense } from "react";

import { AdminPageGate, adminMetadata } from "@/features/admin/admin-page";
import { OrdersPage } from "@/features/admin/orders/orders-page";

export function generateMetadata({ params }: PageProps<"/[locale]/admin/orders">) {
  return adminMetadata(params, "orders");
}

// The orders (SEC-62, Figma AD-DH1): built in full, empty until SEC-15 gives the admin its orders.
export default function AdminOrders({ searchParams }: PageProps<"/[locale]/admin/orders">) {
  return (
    <AdminPageGate page="orders">
      <Suspense fallback={null}>
        <OrdersPage query={searchParams} />
      </Suspense>
    </AdminPageGate>
  );
}
