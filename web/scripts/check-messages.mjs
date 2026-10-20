// Fails when the Vietnamese and English message catalogs do not have exactly the same keys, or when a
// message is empty: every string is shown in both languages (PRODUCT.md › Product Principles). The admin's
// catalogs, one pair per page in messages/admin/ (SEC-62), are checked pair by pair the same way.
// Adapted from BeyondPilot's web/scripts/check-messages.mjs.
import { readdir, readFile } from "node:fs/promises";

const locales = ["vi", "en"];

function entriesOf(value, prefix = "") {
  return Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return child !== null && typeof child === "object" ? entriesOf(child, path) : [[path, child]];
  });
}

const problems = [];
let keys = 0;

/** Compares one catalog in both languages: `file(locale)` names its file under messages/. */
async function check(file) {
  const catalogs = {};
  for (const locale of locales) {
    let text;
    try {
      text = await readFile(new URL(`../messages/${file(locale)}`, import.meta.url), "utf8");
    } catch {
      problems.push(`messages/${file(locale)} is missing`);
      return;
    }
    catalogs[locale] = new Map(entriesOf(JSON.parse(text)));
  }
  for (const locale of locales) {
    for (const [key, message] of catalogs[locale]) {
      if (typeof message !== "string" || message.trim() === "") {
        problems.push(`messages/${file(locale)} has an empty message at "${key}"`);
      }
      for (const other of locales) {
        if (!catalogs[other].has(key)) {
          problems.push(`messages/${file(other)} is missing "${key}" (present in ${file(locale)})`);
        }
      }
    }
  }
  keys += catalogs.vi.size;
}

await check((locale) => `${locale}.json`);
const admin = new Set(
  (await readdir(new URL("../messages/admin/", import.meta.url)))
    .map((name) => /^([\w-]+)\.(?:vi|en)\.json$/.exec(name)?.[1])
    .filter(Boolean),
);
for (const name of admin) await check((locale) => `admin/${name}.${locale}.json`);

if (problems.length > 0) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`Message catalogs match (${keys} keys, ${admin.size} admin catalogs).`);
