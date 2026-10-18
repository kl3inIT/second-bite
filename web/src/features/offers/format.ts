// Prices in đồng are written one way in both languages, as DESIGN.md shows them: "39.000đ".
const dong = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 });

export function formatPrice(amount: number): string {
  return `${dong.format(amount)}đ`;
}
