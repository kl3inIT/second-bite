import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 p-4">
      <h1 className="text-display text-foreground">Second Bite</h1>
      <div className="flex w-full max-w-sm flex-col gap-2 rounded-xl bg-card p-4 shadow-card">
        <p className="text-label text-muted-foreground">Tiệm bánh Pháp · Tầng 1</p>
        <p className="text-title text-card-foreground">Túi bánh mì và croissant, 4 chiếc</p>
        <p className="text-price text-primary">39.000đ</p>
        <span className="self-start rounded-sm bg-signature px-3 py-1 text-body-sm-strong text-signature-foreground shadow-band">
          Lấy 21:00–21:45 · còn 3
        </span>
        <Button>Giữ món</Button>
        <Button variant="outline">Báo cho tôi</Button>
      </div>
    </main>
  );
}
