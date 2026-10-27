"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

// TanStack Query keeps the server data a screen holds in the browser (docs/guidelines/web.md › Stack): the order
// chat and the unread counts. The first is kept fresh by the live socket, so a read is never repeated on focus.
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } } }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
