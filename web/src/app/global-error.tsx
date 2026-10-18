"use client";

import "./globals.css";

// Replaces the root layout when it fails, so no translation provider exists here: the one screen
// whose words are written inline, in both languages. As in BeyondPilot's web/src/app/global-error.tsx.
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  const digest =
    typeof error === "object" && error !== null && "digest" in error
      ? String(error.digest)
      : undefined;

  return (
    <html lang="vi">
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground antialiased">
        <title>Second Bite</title>
        <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-4 p-4">
          <h1 className="font-display text-h1">Đã có lỗi xảy ra · Something went wrong</h1>
          <p className="text-body">Vui lòng thử lại. · Please try again.</p>
          {digest && <p className="text-body-sm">Mã tham chiếu · Reference: {digest}</p>}
          <button
            type="button"
            className="h-11 w-fit rounded-md bg-primary px-4 font-semibold text-primary-foreground hover:bg-primary-hover"
            onClick={() => retry()}
          >
            Thử lại · Try again
          </button>
        </main>
      </body>
    </html>
  );
}
