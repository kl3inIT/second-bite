import { encode } from "uqr";

// The order as a QR code (Figma D3 › QR nhận hàng), drawn on the server from its identifier, which is random,
// so the counter finds the order by scanning it (SEC-86). The words beside it say what to do, so the drawing is
// hidden from a screen reader.
export function OrderQr({ orderId }: { orderId: string }) {
  const { data, size } = encode(orderId, { border: 0 });
  const dark = data.flatMap((row, y) => row.flatMap((on, x) => (on ? [`M${x} ${y}h1v1h-1z`] : [])));

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden
      shapeRendering="crispEdges"
      className="size-30 shrink-0 fill-foreground"
    >
      <path d={dark.join("")} />
    </svg>
  );
}
