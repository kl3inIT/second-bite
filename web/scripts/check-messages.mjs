// Fails when the Vietnamese and English message catalogs do not have exactly the same keys, or when a
// message is empty: every string is shown in both languages (PRODUCT.md › Product Principles).
// Adapted from BeyondPilot's web/scripts/check-messages.mjs.
import { readFile } from "node:fs/promises";

const locales = ["vi", "en"];

function entriesOf(value, prefix = "") {
  return Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return child !== null && typeof child === "object" ? entriesOf(child, path) : [[path, child]];
  });
}

const catalogs = Object.fromEntries(
  await Promise.all(
    locales.map(async (locale) => {
      const text = await readFile(new URL(`../messages/${locale}.json`, import.meta.url), "utf8");
      return [locale, new Map(entriesOf(JSON.parse(text)))];
    }),
  ),
);

const problems = [];
for (const locale of locales) {
  for (const [key, message] of catalogs[locale]) {
    if (typeof message !== "string" || message.trim() === "") {
      problems.push(`messages/${locale}.json has an empty message at "${key}"`);
    }
    for (const other of locales) {
      if (!catalogs[other].has(key)) {
        problems.push(`messages/${other}.json is missing "${key}" (present in ${locale}.json)`);
      }
    }
  }
}

if (problems.length > 0) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`Message catalogs match (${catalogs.vi.size} keys).`);
