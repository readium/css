import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: "./tests",
  outputDir: "./tests/test-results",
  snapshotPathTemplate: "tests/snapshots/{arg}{ext}",
  reporter: [
    ["json", { outputFile: "tests/test-results/results.json" }],
    ["html", { open: process.argv.includes("--update-snapshots") ? "never" : "always", outputFolder: "tests/playwright-report" }]
  ],
  use: {
    baseURL: "http://localhost:8000",
    viewport: { width: 1024, height: 768 },
    browserName: "chromium",
    screenshot: "on",
    launchOptions: {
      args: ["--no-sandbox"],
    },
  },
  webServer: {
    command: "npm run start",
    url: "http://localhost:8000/tests/base.html",
    reuseExistingServer: !process.env.CI,
  },
});
