// Prices in đồng are written one way in both languages, as DESIGN.md shows them: "39.000đ".
const dong = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 });

export function formatPrice(amount: number): string {
  return `${dong.format(amount)}đ`;
}

/** Hour and minute of a window's edge, 24-hour, in Vietnam time whoever reads it. */
export const windowTime = { hour: "2-digit", minute: "2-digit", hourCycle: "h23" } as const;
