// Writes src/styles/tokens.css and the Flutter app_ui package's tokens.g.dart from the frontmatter of
// DESIGN.md, the one source of the design tokens (docs/guidelines/figma.md › Tokens). The palette mirrors the Figma variables under their own names;
// a colour role either takes a palette colour (`"{palette.brand-800}"`, written as `var(--brand-800)`) or a
// literal hex. It refuses tokens whose text would be hard to read:
// every `x` with an `x-foreground`, and every `x-hover` against `x-foreground`, must reach 4.5:1
// (WCAG 2.2 AA for body text). With --check it writes nothing and fails when a file on disk
// differs, so a hand edit to either file or a forgotten regeneration stops `pnpm check`.
import { readFile, writeFile } from "node:fs/promises";
import { parse } from "yaml";

const MIN_TEXT_CONTRAST = 4.5;

const designPath = new URL("../../DESIGN.md", import.meta.url);
const tokensPath = new URL("../src/styles/tokens.css", import.meta.url);
const dartPath = new URL(
  "../../mobile/packages/app_ui/lib/src/theme/tokens.g.dart",
  import.meta.url,
);

const design = await readFile(designPath, "utf8");
const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(design);
if (!frontmatter) throw new Error("DESIGN.md has no frontmatter");
const { palette, colors: roles, typography, rounded, spacing, elevation } = parse(frontmatter[1]);

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
  ["muted-foreground", "card", MIN_TEXT_CONTRAST],
  ["muted-foreground", "muted", MIN_TEXT_CONTRAST],
  ["muted-foreground", "background", MIN_TEXT_CONTRAST],
  ["link", "card", MIN_TEXT_CONTRAST],
  ["link", "background", MIN_TEXT_CONTRAST],
  ["primary", "secondary", MIN_TEXT_CONTRAST],
  ["input", "card", 3],
  ["ring", "card", 3],
  ["ring", "background", 3],
  ["ring", "header", 3],
  // Lime figures and soft text on Deep Leaf (the deal card), and lime ink on the quiet lime surface.
  ["fresh", "primary", MIN_TEXT_CONTRAST],
  ["inverse-muted", "primary", MIN_TEXT_CONTRAST],
  ["fresh-foreground", "fresh-muted", MIN_TEXT_CONTRAST],
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

// The Dart file holds the same roles as constants, written as `dart format` would write them; app_ui's
// theme maps them onto Material (docs/guidelines/mobile.md › Design tokens and theming).
const DART_WIDTH = 80;
const DART_PACKAGE = "app_ui";

// `primary-foreground` becomes `primaryForeground`; a name starting with a digit takes its group's name
// first, so the radius `2xl` becomes `radius2xl` and the spacing step `4` becomes `space4`.
function dartName(group, name) {
  const camel = name.replace(/-(\w)/g, (_, c) => c.toUpperCase());
  return /^\d/.test(camel) ? `${group}${camel}` : camel;
}

// `#RRGGBB` or `#RRGGBBAA` as Flutter's `Color(0xAARRGGBB)`.
function dartColor(hex) {
  const digits = hex.slice(1).toUpperCase();
  const alpha = digits.length === 8 ? digits.slice(6) : "FF";
  return `Color(0x${alpha}${digits.slice(0, 6)})`;
}

const pixels = (value) => Number.parseFloat(value);

// A call on one line when it fits, otherwise one argument per line with a trailing comma.
function dartCall(indent, head, args, tail) {
  const flat = `${indent}${head}(${args.join(", ")})${tail}`;
  if (flat.length <= DART_WIDTH) return [flat];
  return [`${indent}${head}(`, ...args.map((arg) => `${indent}  ${arg},`), `${indent})${tail}`];
}

function dartTextStyle(name, style) {
  const size = pixels(style.fontSize);
  // A CSS line height in px is a multiple of the font size in Flutter; the even split matches CSS.
  const height = style.lineHeight.endsWith("px")
    ? `${pixels(style.lineHeight)} / ${size}`
    : `${style.lineHeight}`;
  const args = [
    `fontFamily: '${style.fontFamily}'`,
    `package: '${DART_PACKAGE}'`,
    `fontSize: ${size}`,
    `fontWeight: FontWeight.w${style.fontWeight}`,
    // Bricolage Grotesque ships as a variable font, whose weight is an axis; a static face ignores it.
    `fontVariations: [FontVariation('wght', ${style.fontWeight})]`,
    `height: ${height}`,
    ...(style.letterSpacing
      ? [`letterSpacing: ${Number((Number.parseFloat(style.letterSpacing) * size).toFixed(4))}`]
      : []),
    "leadingDistribution: TextLeadingDistribution.even",
  ];
  return dartCall("  ", `static const ${dartName("type", name)} = TextStyle`, args, ";");
}

function dartShadow(name, layers) {
  const shadows = layers.map(({ x, y, blur, spread, color }) => [
    `color: ${dartColor(color)}`,
    `offset: Offset(${x}, ${y})`,
    ...(blur ? [`blurRadius: ${blur}`] : []),
    ...(spread ? [`spreadRadius: ${spread}`] : []),
  ]);
  const head = `  static const ${dartName("shadow", name)} = [`;
  const single = shadows.length === 1 && dartCall("", "BoxShadow", shadows[0], "")[0];
  if (single && `${head}${single}];`.length <= DART_WIDTH) return [`${head}${single}];`];
  return [head, ...shadows.flatMap((args) => dartCall("    ", "BoxShadow", args, ",")), "  ];"];
}

function dartClass(doc, name, members) {
  return [`/// ${doc}`, `abstract final class ${name} {`, ...members, "}", ""];
}

const dart = [
  "// Generated from DESIGN.md by web/scripts/generate-tokens.mjs; do not edit.",
  "// Run `pnpm generate:tokens` in web/.",
  "",
  "import 'package:flutter/painting.dart';",
  "",
  ...dartClass(
    "The colour roles of DESIGN.md.",
    "ColorTokens",
    Object.entries(colors).map(
      ([name, hex]) => `  static const ${dartName("color", name)} = ${dartColor(hex)};`,
    ),
  ),
  ...dartClass(
    "The type roles of DESIGN.md.",
    "TypeTokens",
    Object.entries(typography).flatMap(([name, style]) => dartTextStyle(name, style)),
  ),
  ...dartClass(
    "The corner radii of DESIGN.md, in logical pixels.",
    "RadiusTokens",
    Object.entries(rounded).map(
      ([name, value]) => `  static const double ${dartName("radius", name)} = ${pixels(value)};`,
    ),
  ),
  ...dartClass(
    "The spacing steps of DESIGN.md, in logical pixels.",
    "SpacingTokens",
    Object.entries(spacing).map(
      ([name, value]) => `  static const double ${dartName("space", name)} = ${pixels(value)};`,
    ),
  ),
  ...dartClass(
    "The shadows of DESIGN.md.",
    "ShadowTokens",
    Object.entries(elevation).flatMap(([name, layers]) => dartShadow(name, layers)),
  ),
]
  .join("\n")
  .replace(/\n$/, "");

const outputs = [
  [tokensPath, css, "web/src/styles/tokens.css"],
  [dartPath, `${dart}\n`, "mobile/packages/app_ui/lib/src/theme/tokens.g.dart"],
];

if (process.argv.includes("--check")) {
  const stale = [];
  for (const [path, content, label] of outputs) {
    const current = await readFile(path, "utf8").catch(() => "");
    if (current !== content) stale.push(label);
  }
  if (stale.length > 0) {
    console.error(
      `${stale.join(" and ")} out of date with DESIGN.md: run \`pnpm generate:tokens\`.`,
    );
    process.exit(1);
  }
} else {
  for (const [path, content] of outputs) await writeFile(path, content);
}
