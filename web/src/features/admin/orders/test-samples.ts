import type { AdminOrder, AdminOrderRow, OrderStatus } from "./order";

// Sample orders for the unit tests only, as Figma AD-DH1 and AD-DH3 draw them (phones 0900 000 1xx,
// addresses @example.com). No running code imports this file.

const sellers = [
  ["s-phap", "Tiệm bánh Pháp"],
  ["s-hanh", "Cơm nhà Hạnh"],
  ["s-may", "Trà sữa Mây"],
  ["s-hang", "Bún chả Phố Hàng"],
] as const;

const statuses: OrderStatus[] = [
  "confirmed",
  "ready",
  "collected",
  "expired",
  "cancelled",
  "rejected",
  "ready",
  "confirmed",
  "collected",
  "expired",
  "collected",
  "confirmed",
];

/** Twelve rows: two pages of ten. Order n picks up at 14:00 UTC + n×10 min (21:00 in Vietnam for n = 0). */
export const sampleRows: AdminOrderRow[] = statuses.map((status, n) => {
  const [sellerId, sellerName] = sellers[n % sellers.length];
  const start = new Date(Date.UTC(2026, 9, 20, 14, n * 10));
  return {
    id: `o-${n}`,
    code: `SB-${24831 - n}`,
    customerName: n === 0 ? "Minh Anh" : `Khách ${n}`,
    customerEmail: `khach${n}@example.com`,
    sellerId,
    sellerName,
    items:
      n === 0
        ? [
            { name: "Croissant", quantity: 2 },
            { name: "Bánh mì chà bông", quantity: 1 },
          ]
        : [{ name: "Cơm gà", quantity: 1 }],
    totalVnd: 30_000 + n * 5_000,
    pickupStart: start.toISOString(),
    pickupEnd: new Date(start.getTime() + 3_600_000).toISOString(),
    status,
  };
});

/** Order #SB-24817, ready, as AD-DH3 draws it. */
export const sampleOrder: AdminOrder = {
  id: "o-24817",
  code: "SB-24817",
  status: "ready",
  placedAt: "2026-10-20T12:52:00Z",
  pickupStart: "2026-10-20T13:30:00Z",
  pickupEnd: "2026-10-20T14:30:00Z",
  totalVnd: 50_000,
  items: [
    {
      offerId: "of-1",
      name: "Bánh mì thập cẩm",
      quantity: 2,
      priceVnd: 25_000,
      originalPriceVnd: 45_000,
    },
  ],
  customer: {
    name: "Ngọc Mai",
    phone: "0900 000 127",
    email: "ngoc.mai@example.com",
    collectedBefore: 5,
    noShowBefore: 0,
  },
  seller: {
    id: "s-hoian",
    name: "Bánh mì Hội An",
    location: "Tầng 1, Tasco Mall",
    phone: "0900 000 107",
    status: "active",
  },
  wrongCodeAttempts: 0,
  maxCodeAttempts: 3,
  history: [
    { kind: "placed", at: "2026-10-20T12:52:00Z" },
    { kind: "confirmed", at: "2026-10-20T12:52:00Z" },
    { kind: "ready", at: "2026-10-20T13:24:00Z" },
  ],
};

/** Order #SB-24824, expired: the customer did not come (AD-DH5). */
export const sampleExpiredOrder: AdminOrder = {
  ...sampleOrder,
  id: "o-24824",
  code: "SB-24824",
  status: "expired",
  closedAt: "2026-10-20T13:31:00Z",
  pickupStart: "2026-10-20T12:30:00Z",
  pickupEnd: "2026-10-20T13:30:00Z",
  totalVnd: 30_000,
  customer: {
    name: "Hoàng Nam",
    phone: "0900 000 124",
    email: "hoang.nam@example.com",
    collectedBefore: 3,
    noShowBefore: 2,
    noShowsIn30Days: 2,
  },
  history: [
    { kind: "placed", at: "2026-10-20T11:47:00Z" },
    { kind: "confirmed", at: "2026-10-20T11:47:00Z" },
    { kind: "ready", at: "2026-10-20T12:28:00Z" },
    { kind: "expired", at: "2026-10-20T13:31:00Z" },
  ],
};
