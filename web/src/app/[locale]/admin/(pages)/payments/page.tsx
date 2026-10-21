import { Suspense } from "react";

import { AdminPageGate, adminMetadata } from "@/features/admin/admin-page";
import { PaymentsPage } from "@/features/admin/payments/payments-page";

export function generateMetadata({ params }: PageProps<"/[locale]/admin/payments">) {
  return adminMetadata(params, "payments");
}

// Payments and refunds (SEC-62, Figma AD-HT1 to AD-HT7): built in full, empty until SEC-18 builds payments.
export default function AdminPayments({ searchParams }: PageProps<"/[locale]/admin/payments">) {
  return (
    <AdminPageGate page="payments">
      <Suspense fallback={null}>
        <PaymentsPage query={searchParams} />
      </Suspense>
    </AdminPageGate>
  );
}
