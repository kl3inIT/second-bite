import { describe, expect, it } from "vitest";

import { requestOrigin } from "@/lib/request-origin";

import { GET } from "./route";

describe("GET /map-style.json", () => {
  it("answers the map's style on the origin the proxy was asked for", async () => {
    const response = GET(
      new Request("http://web:3000/map-style.json", {
        headers: { host: "preview.secondbite.vadan.app", "x-forwarded-proto": "https" },
      }),
    );
    expect(response.headers.get("cache-control")).toBe("public, max-age=3600");
    const style = await response.json();
    expect(style.version).toBe(8);
    expect(style.sources.protomaps.url).toBe(
      "pmtiles://https://preview.secondbite.vadan.app/map/hanoi.pmtiles",
    );
    expect(style.glyphs).toBe(
      "https://preview.secondbite.vadan.app/map/fonts/{fontstack}/{range}.pbf",
    );
  });

  it("keeps the request's own scheme without a proxy, and ignores an unknown one", () => {
    expect(requestOrigin(new Request("http://localhost:3100/map-style.json"))).toBe(
      "http://localhost:3100",
    );
    expect(
      requestOrigin(
        new Request("http://localhost:3100/map-style.json", {
          headers: { "x-forwarded-proto": "javascript" },
        }),
      ),
    ).toBe("http://localhost:3100");
  });
});
