import {
  CircleCheckIcon,
  CircleXIcon,
  ClockIcon,
  type LucideIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { AdminBadge, type BadgeTone } from "../ui/badge";
import type { PaymentMethod, RefundStatus, TransactionStatus } from "./payment";

/** How it was paid, in words only (Figma AD-HT1 › Phương thức): "VietQR" in blue, "Tiền mặt" in grey. */
export function MethodBadge({ method }: { method: PaymentMethod }) {
  const t = useTranslations("admin.payments.method");
  return (
    <AdminBadge tone={method === "vietqr" ? "info" : "neutral"} icon={null}>
      {t(method)}
    </AdminBadge>
  );
}

const transactionLooks: Record<TransactionStatus, { tone: BadgeTone; icon: LucideIcon }> = {
  confirmed: { tone: "success", icon: CircleCheckIcon },
  awaitingSepay: { tone: "neutral", icon: ClockIcon },
  mismatch: { tone: "warning", icon: TriangleAlertIcon },
};

/** A payment's state with its icon (AD-HT1): "Đã xác nhận", "Chờ SePay", "Không khớp". */
export function TransactionStatusBadge({ status }: { status: TransactionStatus }) {
  const t = useTranslations("admin.payments.transactions.status");
  const { tone, icon } = transactionLooks[status];
  return (
    <AdminBadge tone={tone} icon={icon}>
      {t(status)}
    </AdminBadge>
  );
}

const refundLooks: Record<RefundStatus, { tone: BadgeTone; icon: LucideIcon }> = {
  pending: { tone: "warning", icon: ClockIcon },
  approved: { tone: "success", icon: CircleCheckIcon },
  rejected: { tone: "error", icon: CircleXIcon },
};

/** A refund request's state with its icon (AD-HT3): "Chờ duyệt", "Đã duyệt", "Từ chối". */
export function RefundStatusBadge({ status }: { status: RefundStatus }) {
  const t = useTranslations("admin.payments.refunds.status");
  const { tone, icon } = refundLooks[status];
  return (
    <AdminBadge tone={tone} icon={icon}>
      {t(status)}
    </AdminBadge>
  );
}
