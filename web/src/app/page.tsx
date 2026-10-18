export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-2 p-4">
      <h1 className="text-display text-foreground">Second Bite</h1>
      <p className="rounded-lg bg-card px-4 py-3 text-body text-card-foreground">
        Một miếng ngon nữa · <span className="text-price text-primary">39.000đ</span>
      </p>
      <span className="rounded-sm bg-signature px-3 py-1 text-body-sm-strong text-signature-foreground">
        Lấy 21:00–21:45 · còn 3
      </span>
    </main>
  );
}
