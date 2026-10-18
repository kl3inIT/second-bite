import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Inter is the typeface (DESIGN.md); next/font serves it from our own origin, Latin and Vietnamese only.
const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Second Bite",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
