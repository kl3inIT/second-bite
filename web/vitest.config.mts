import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

// Unit tests sit next to what they test as `*.test.ts` and run in Node. A DOM project with Testing
// Library arrives with the first component test (BeyondPilot's web/vitest.config.mts has the shape).
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: { include: ["src/**/*.test.ts"], environment: "node" },
});
