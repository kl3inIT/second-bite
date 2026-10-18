// Writes src/styles/tokens.css from the frontmatter of DESIGN.md, the one source of the design
// tokens (docs/guidelines/figma.md › Tokens). The palette mirrors the Figma variables under their own names;
// a colour role either takes a palette colour (`"{palette.brand-800}"`, written as `var(--brand-800)`) or a
// literal hex. It refuses tokens whose text would be hard to read:
// every `x` with an `x-foreground`, and every `x-hover` against `x-foreground`, must reach 4.5:1
// (WCAG 2.2 AA for body text). With --check it writes nothing and fails when the file on disk
// differs, so a hand edit to tokens.css or a forgotten regeneration stops `pnpm check`.
import { readFile, writeFile } from "node:fs/promises";
import { parse } from "yaml";

const MIN_TEXT_CONTRAST = 4.5;

const designPath = new URL("../../DESIGN.md", import.meta.url);
const tokensPath = new URL("../src/styles/tokens.css", import.meta.url);

const design = await readFile(designPath, "utf8");
const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(design);
if (!frontmatter) throw new Error("DESIGN.md has no frontmatter");
const { palette, colors: roles, typography, rounded, elevation } = parse(frontmatter[1]);

// Each role as a hex, for the contrast checks, and as the CSS it is written with.
const alias = /^\{palette\.([\w-]+)\}$/;
const colors = {};
const roleCss = {};
for (const [name, value] of Object.entries(roles)) {
  const reference = alias.exec(value)?.[1];
  if (reference && !(reference in palette)) {
    throw new Error(
      `DESIGN.md colour ${name} refers to {palette.${reference}}, which does not exist`,
    );
  }
  colors[name] = reference ? palette[reference] : value;
  roleCss[name] = reference ? `var(--${reference})` : value;
}

// Relative luminance and contrast ratio as WCAG 2.2 defines them.
function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

const failures = [];
for (const [name, value] of Object.entries(colors)) {
  const base = name.endsWith("-hover") ? name.slice(0, -"-hover".length) : name;
  const ink = colors[`${base}-foreground`];
  if (!ink || name.endsWith("-foreground")) continue;
  const ratio = contrast(value, ink);
  if (ratio < MIN_TEXT_CONTRAST) {
    failures.push(
      `${base}-foreground on ${name}: ${ratio.toFixed(2)}:1, needs ${MIN_TEXT_CONTRAST}:1`,
    );
  }
}
// Pairs without the `-foreground` naming: page text on the ground, secondary text on the surfaces
// DESIGN.md allows it on (The Label Rule), and control outlines and focus rings at 3:1 (WCAG 1.4.11).
const pairs = [
  ["foreground", "background", MIN_TEXT_CONTRAST],
  ["soft-foreground", "background", MIN_TEXT_CONTRAST],
  ["muted-foreground", "card", MIN_TEXT_CONTRAST],
  ["muted-foreground", "muted", MIN_TEXT_CONTRAST],
  ["input", "card", 3],
  ["ring", "card", 3],
  ["ring", "background", 3],
  // Every seller avatar colour carries the one avatar ink.
  ...Object.keys(colors)
    .filter((name) => name.startsWith("avatar-") && name !== "avatar-foreground")
    .map((name) => ["avatar-foreground", name, MIN_TEXT_CONTRAST]),
];
for (const [fore, back, minimum] of pairs) {
  const ratio = contrast(colors[fore], colors[back]);
  if (ratio < minimum)
    failures.push(`${fore} on ${back}: ${ratio.toFixed(2)}:1, needs ${minimum}:1`);
}
if (failures.length > 0) {
  console.error(`These DESIGN.md colour pairs are too weak:\n  ${failures.join("\n  ")}`);
  process.exit(1);
}

function shadow(layers) {
  return layers
    .map(({ x, y, blur, spread, color, inset }) =>
      [inset ? "inset" : "", `${x}px ${y}px ${blur}px ${spread}px ${color}`].join(" ").trim(),
    )
    .join(", ");
}

const lines = [
  "/* Generated from DESIGN.md by scripts/generate-tokens.mjs; do not edit. Run `pnpm generate:tokens`. */",
  "",
  ":root {",
  ...Object.entries(palette).map(([name, value]) => `  --${name}: ${value};`),
  "",
  ...Object.entries(roleCss).map(([name, value]) => `  --${name}: ${value};`),
  "}",
  "",
  "@theme inline {",
  ...Object.keys(colors).map((name) => `  --color-${name}: var(--${name});`),
  ...Object.entries(rounded).map(([name, value]) => `  --radius-${name}: ${value};`),
  ...Object.entries(elevation).map(([name, layers]) => `  --shadow-${name}: ${shadow(layers)};`),
  ...Object.entries(typography).flatMap(([name, style]) => [
    `  --text-${name}: ${style.fontSize};`,
    `  --text-${name}--line-height: ${style.lineHeight};`,
    `  --text-${name}--font-weight: ${style.fontWeight};`,
    ...(style.letterSpacing ? [`  --text-${name}--letter-spacing: ${style.letterSpacing};`] : []),
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
