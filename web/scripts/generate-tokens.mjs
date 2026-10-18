// Writes src/styles/tokens.css from the frontmatter of DESIGN.md, the one source of the design
// tokens (docs/guidelines/figma.md › Tokens). With --check it writes nothing and fails when the file
// on disk differs, so a hand edit to tokens.css or a forgotten regeneration stops `pnpm check`.
import { readFile, writeFile } from "node:fs/promises";
import { parse } from "yaml";

const designPath = new URL("../../DESIGN.md", import.meta.url);
const tokensPath = new URL("../src/styles/tokens.css", import.meta.url);

const design = await readFile(designPath, "utf8");
const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(design);
if (!frontmatter) throw new Error("DESIGN.md has no frontmatter");
const { colors, typography, rounded } = parse(frontmatter[1]);

const lines = [
  "/* Generated from DESIGN.md by scripts/generate-tokens.mjs; do not edit. Run `pnpm generate:tokens`. */",
  "",
  ":root {",
  ...Object.entries(colors).map(([name, value]) => `  --${name}: ${value};`),
  "}",
  "",
  "@theme inline {",
  ...Object.keys(colors).map((name) => `  --color-${name}: var(--${name});`),
  ...Object.entries(rounded).map(([name, value]) => `  --radius-${name}: ${value};`),
  ...Object.entries(typography).flatMap(([name, style]) => [
    `  --text-${name}: ${style.fontSize};`,
    `  --text-${name}--line-height: ${style.lineHeight};`,
    `  --text-${name}--font-weight: ${style.fontWeight};`,
  ]),
  "}",
  "",
];
const css = lines.join("\n");

if (process.argv.includes("--check")) {
  const current = await readFile(tokensPath, "utf8").catch(() => "");
  if (current !== css) {
    console.error(
      "src/styles/tokens.css is out of date with DESIGN.md: run `pnpm generate:tokens`.",
    );
    process.exit(1);
  }
} else {
  await writeFile(tokensPath, css);
}
