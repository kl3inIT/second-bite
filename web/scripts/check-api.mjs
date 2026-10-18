// Regenerates the API client from api/openapi.yaml and fails when the committed output was stale.
// The regenerated files stay in place, so committing them fixes the failure. Adapted from BeyondPilot's
// web/scripts/check-api.mjs; generation runs in tools/openapi, on TypeScript 6 (see its package.json).
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const generated = "src/lib/api/generated";

function snapshot(directory, files = new Map()) {
  if (!existsSync(directory)) return files;
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) snapshot(path, files);
    else
      files.set(
        relative(generated, path),
        createHash("sha256").update(readFileSync(path)).digest("hex"),
      );
  }
  return files;
}

const before = snapshot(generated);
// openapi-ts resolves TypeScript from the directory it runs in, so it runs in tools/openapi.
const tool = fileURLToPath(new URL("../tools/openapi/", import.meta.url));
const manifest = createRequire(tool).resolve("@hey-api/openapi-ts/package.json");
const { bin } = JSON.parse(readFileSync(manifest, "utf8"));
const cli = join(dirname(manifest), typeof bin === "string" ? bin : bin["openapi-ts"]);
execFileSync(process.execPath, [cli], { cwd: tool, stdio: ["ignore", "ignore", "inherit"] });
const after = snapshot(generated);
if (after.size === 0) {
  console.error("openapi-ts generated nothing; check tools/openapi/openapi-ts.config.ts.");
  process.exit(1);
}

const changed = [...new Set([...before.keys(), ...after.keys()])]
  .filter((path) => before.get(path) !== after.get(path))
  .sort((a, b) => a.localeCompare(b));

if (changed.length > 0) {
  console.error(
    `The generated API client was stale; commit the regenerated files:\n- ${changed.join("\n- ")}`,
  );
  process.exit(1);
}
console.log(`The API client matches api/openapi.yaml (${after.size} files).`);
