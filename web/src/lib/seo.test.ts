import { describe, expect, it } from "vitest";

import { absoluteUrl, jsonLd, pageMetadata } from "./seo";

describe("pageMetadata", () => {
  it("names a public page's canonical address, its other language and x-default", () => {
    const metadata = pageMetadata({ locale: "en", path: "/terms", title: "Terms of use" });

    expect(metadata.alternates).toEqual({
      canonical: "/en/terms",
      languages: { vi: "/vi/terms", en: "/en/terms", "x-default": "/vi/terms" },
    });
    expect(metadata.openGraph).toMatchObject({
      url: "/en/terms",
      locale: "en_US",
      alternateLocale: ["vi_VN"],
    });
    expect(metadata.robots).toBeUndefined();
  });

  it("keeps a private page out of the index and gives it no alternates", () => {
    const metadata = pageMetadata({ locale: "vi", title: "Tài khoản", index: false });

    expect(metadata.robots).toEqual({ index: false, follow: true });
    expect(metadata.alternates).toBeUndefined();
  });

  it("leaves the layout's title in place when a page names none", () => {
    expect(pageMetadata({ locale: "vi" })).not.toHaveProperty("title");
  });
});

describe("absoluteUrl", () => {
  it("builds a page's address on the public origin", () => {
    expect(absoluteUrl("vi", "/privacy")).toMatch(/^https?:\/\/[^/]+\/vi\/privacy$/);
  });
});

describe("jsonLd", () => {
  it("escapes < so page text cannot close the script", () => {
    expect(jsonLd({ name: "</script><b>" })).toBe('{"name":"\\u003c/script>\\u003cb>"}');
  });
});
