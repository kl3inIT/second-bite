// Prices in đồng are written one way in both languages, as DESIGN.md shows them: "39.000đ".
const dong = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 });

export function formatPrice(amount: number): string {
  return `${dong.format(amount)}đ`;
}

/**
 * A price or a total as customers and stores read it: `free` (the message Price.free, "Miễn phí") for food given
 * away at 0đ, else the price. Sums that are not a price, such as takings or a discount, stay formatPrice.
 */
export function formatCost(amount: number, free: string): string {
  return amount === 0 ? free : formatPrice(amount);
}
