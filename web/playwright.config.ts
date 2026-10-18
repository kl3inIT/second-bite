import { defineConfig, devices } from "@playwright/test";

const port = 3100;

// The production build in a phone and a desktop browser. Adapted from BeyondPilot's
// web/playwright.config.ts; a stub backend joins when the first page reads the API.
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
  webServer: {
    // `next` directly, not `pnpm start`: BeyondPilot found a pnpm process that outlived Playwright's
    // kill on Linux and hung the run after the last test.
    command: `next build && next start --port ${port}`,
    url: `http://localhost:${port}/vi`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
