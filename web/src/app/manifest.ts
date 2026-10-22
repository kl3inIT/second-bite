import type { MetadataRoute } from "next";

import vi from "../../messages/vi.json";

// What a phone installs to its Home Screen (SEC-25): an iPhone gets push only from the installed web app. It is in
// Vietnamese, the site's default language. The
// colours are DESIGN.md's ground (brand-50) and Tasco blue (brand-800); the icons are public/icons, drawn with the
// bitten corner.
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: vi.Metadata.title,
    short_name: vi.Metadata.title,
    description: vi.Metadata.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#EEF8FD",
    theme_color: "#0061AF",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
