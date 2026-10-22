import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { stored } from "./stored";

function storage(items: Record<string, string>, { full = false } = {}) {
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => items[key] ?? null,
    setItem: (key: string, value: string) => {
      if (full) throw new DOMException("full", "QuotaExceededError");
      items[key] = value;
    },
    removeItem: (key: string) => delete items[key],
  });
  vi.stubGlobal("window", { addEventListener() {}, removeEventListener() {} });
}

afterEach(() => vi.unstubAllGlobals());

describe("a value kept in browser storage", () => {
  it("reads as the fallback when what is stored is not what the schema describes", () => {
    storage({ ids: '["a", 1]' });

    expect(stored("ids", z.array(z.string()), []).read()).toEqual([]);
  });

  it("still shows a value storage refused, and tells the page it changed", () => {
    storage({}, { full: true });
    const ids = stored("ids", z.array(z.string()), []);
    const listener = vi.fn();
    ids.subscribe(listener);

    ids.save(["a"]);

    expect(ids.read()).toEqual(["a"]);
    expect(listener).toHaveBeenCalledOnce();
  });
});
