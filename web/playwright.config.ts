import { defineConfig, devices } from "@playwright/test";

const port = 3100;
const stubBackendPort = 3190;

// The production build in a phone and a desktop browser. Adapted from BeyondPilot's
// web/playwright.config.ts. The backend is a stub (tests/e2e/stub-backend.mjs).
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [["html", { open: "never" }], ["list"]] : "list",
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "retain-on-failure",
    reducedMotion: "reduce",
  },
  projects: [
    { name: "mobile", use: { ...devices["Pixel 7"] } },
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: [
    {
      command: "node tests/e2e/stub-backend.mjs",
      url: `http://localhost:${stubBackendPort}/health`,
      env: { STUB_BACKEND_PORT: String(stubBackendPort) },
      reuseExistingServer: !process.env.CI,
    },
    {
      // `next` directly, not `pnpm start`: BeyondPilot found a pnpm process that outlived
      // Playwright's kill on Linux and hung the run after the last test.
      command: `next build && next start --port ${port}`,
      url: `http://localhost:${port}/vi`,
      reuseExistingServer: !process.env.CI,
      timeout: 240_000,
      env: { SECONDBITE_API_ORIGIN: `http://localhost:${stubBackendPort}` },
    },
  ],
});
