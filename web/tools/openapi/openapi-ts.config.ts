import { defineConfig } from "@hey-api/openapi-ts";

// The client, the SDK and the types of the backend's contract, generated from the OpenAPI document the
// Go server writes (api/openapi.yaml). The TanStack Query plugin arrives with the first screen that
// reads through it. It runs in this package on TypeScript 6 (package.json here explains why).
export default defineConfig({
  input: "../../../api/openapi.yaml",
  output: "../../src/lib/api/generated",
  plugins: [
    // Every SDK call rejects with ApiError on a failed request (src/lib/api/client.ts).
    {
      name: "@hey-api/client-next",
      runtimeConfigPath: "../../src/lib/api/client",
      throwOnError: true,
    },
    "@hey-api/typescript",
    "@hey-api/sdk",
  ],
});
