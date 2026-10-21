const orderId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * The order an order's QR stands for (SEC-86 draws the order's identifier as it is); undefined for any other
 * text a camera may read, a shop's menu or a link, which is no order.
 */
export function orderIdOf(code: string): string | undefined {
  const text = code.trim();
  return orderId.test(text) ? text.toLowerCase() : undefined;
}
