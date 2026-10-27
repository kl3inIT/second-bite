import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, normalize } from "node:path";

import { describe, expect, it } from "vitest";

import vi from "../../messages/vi.json";

import { ADMIN_ONLY, SERVER_ONLY } from "./client-messages";

const SRC = normalize(join(__dirname, ".."));

function sources(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sources(path);
    return /\.tsx?$/.test(entry.name) && !entry.name.includes(".test.") ? [path] : [];
  });
}

const files = new Map(sources(SRC).map((path) => [path, readFileSync(path, "utf8")]));

function resolve(from: string, spec: string): string | undefined {
  const base = spec.startsWith("@/")
    ? join(SRC, spec.slice(2))
    : spec.startsWith(".")
      ? join(dirname(from), spec)
      : undefined;
  if (!base) return undefined;
  return [base, `${base}.ts`, `${base}.tsx`, join(base, "index.ts"), join(base, "index.tsx")]
    .map(normalize)
    .find((candidate) => files.has(candidate));
}

/** Every module a client component imports, at any depth: what may run in the browser. */
function clientModules(): Set<string> {
  const reached = new Set(
    [...files]
      .filter(([, text]) => /^\s*(\/\/[^\n]*\n\s*)*["']use client["']/.test(text))
      .map(([p]) => p),
  );
  const pending = [...reached];
  const imports =
    /(?:import|export)\s+(?!type\s)(?:[^"']*?\s+from\s+)?["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)/g;
  while (pending.length) {
    const path = pending.pop()!;
    for (const match of files.get(path)!.matchAll(imports)) {
      const next = resolve(path, match[1] ?? match[2]);
      if (next && !reached.has(next)) {
        reached.add(next);
        pending.push(next);
      }
    }
  }
  return reached;
}

function namespacesReadBy(paths: Iterable<string>): Set<string> {
  const read = new Set<string>();
  for (const path of paths) {
    for (const match of files.get(path)!.matchAll(/useTranslations\(\s*"([^".]+)/g))
      read.add(match[1]);
  }
  return read;
}

describe("the messages sent to the browser (SEC-166)", () => {
  const client = clientModules();
  const read = namespacesReadBy(client);

  it("leave out only namespaces no client component reads", () => {
    expect(SERVER_ONLY.filter((namespace) => read.has(namespace))).toEqual([]);
  });

  it("name namespaces the catalog has", () => {
    expect([...SERVER_ONLY, ...ADMIN_ONLY].filter((namespace) => !(namespace in vi))).toEqual([]);
  });

  it("read the admin's namespace only in the admin's own code", () => {
    const outside = [...client].filter(
      (path) =>
        namespacesReadBy([path]).has("Admin") &&
        !/\/(admin[^/]*|accounts|audit)\//.test(path.replaceAll("\\", "/")) &&
        !path.endsWith("email-settings-form.tsx"),
    );
    expect(outside).toEqual([]);
  });
});
