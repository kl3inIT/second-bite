// Fails when a failure code of the Go server has no words in the catalogs and is not listed here as
// deliberately general, and when the catalogs word a code the server no longer raises
// (docs/guidelines/web.md › Data and the backend). Adapted from BeyondPilot's
// web/scripts/check-error-codes.mjs, reading Go instead of Java.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * The codes no person can be refused with on a screen, each with why. A request that fails with one
 * of them is said in the general words, Errors.unknown. A code a person can meet gets words instead.
 */
const general = {
  PLATFORM_REQUEST_INVALID:
    "A request the web built wrongly; its fields' violations are shown at the fields, not this code.",
  PLATFORM_VALUE_INVALID: "The code of one violation inside a problem, never a problem's own code.",
  PLATFORM_ROUTE_NOT_FOUND: "An address the web does not call.",
  PLATFORM_METHOD_NOT_ALLOWED: "A method the web does not use.",
  PLATFORM_NOT_ACCEPTABLE: "The web always accepts JSON.",
  PLATFORM_MEDIA_TYPE_UNSUPPORTED: "The web always sends a type the operation takes.",
  PLATFORM_REQUEST_REFUSED: "A refusal without a code of its own, which has nothing more to say.",
  PLATFORM_INTERNAL_FAILURE: "Says nothing more than the general words.",
};

/** The codes a Go source declares: a module's NewFailure calls, and the platform's Code constants. */
function codesOf(source) {
  return [
    ...source.matchAll(/NewFailure\(\s*"([A-Z0-9_]+)"/g),
    ...source.matchAll(/^\s*Code\w+\s*=\s*"([A-Z0-9_]+)"/gm),
  ].map((match) => match[1]);
}

function goFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return goFiles(path);
    return entry.name.endsWith(".go") && !entry.name.endsWith("_test.go") ? [path] : [];
  });
}

const server = fileURLToPath(new URL("../../server/internal", import.meta.url));
const codes = new Set(goFiles(server).flatMap((path) => codesOf(readFileSync(path, "utf8"))));
if (codes.size === 0) {
  console.error(`No failure code found under ${server}; the check read nothing.`);
  process.exit(1);
}

const problems = new Set();
for (const locale of ["vi", "en"]) {
  const catalog = `messages/${locale}.json`;
  const messages = JSON.parse(readFileSync(new URL(`../${catalog}`, import.meta.url), "utf8"));
  const worded = new Set(Object.keys(messages.Errors ?? {}).filter((key) => key !== "unknown"));
  for (const code of codes) {
    if (!worded.has(code) && !Object.hasOwn(general, code)) {
      problems.add(
        `${code} has no words: add Errors.${code} to ${catalog}, or list it in scripts/check-error-codes.mjs with the reason no screen meets it`,
      );
    }
    if (worded.has(code) && Object.hasOwn(general, code)) {
      problems.add(`${code} has words in ${catalog} and is also listed as general: keep one`);
    }
  }
  for (const code of worded) {
    if (!codes.has(code))
      problems.add(`${catalog} words Errors.${code}, which the server does not raise`);
  }
}
for (const code of Object.keys(general)) {
  if (!codes.has(code))
    problems.add(`${code} is listed as general, and the server does not raise it`);
}

if (problems.size > 0) {
  for (const problem of problems) console.error(problem);
  process.exit(1);
}
console.log(
  `Failure codes are covered (${codes.size} codes, ${Object.keys(general).length} deliberately general).`,
);
