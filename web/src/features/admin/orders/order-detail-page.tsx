import { notFound } from "next/navigation";
import { connection } from "next/server";

import { OrderDetail } from "./order-detail";
import { getAdminOrder } from "./orders-source";

/** One order (Figma AD-DH3); every address gets the admin's not-found page until SEC-15 returns orders. */
export async function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const order = await getAdminOrder(orderId);
  if (!order) notFound();
  return <OrderDetail order={order} now={await requestTime()} />;
}

// "Còn 38 phút" counts from the moment of the request, never from a cached render.
async function requestTime(): Promise<Date> {
  await connection();
  return new Date();
}
