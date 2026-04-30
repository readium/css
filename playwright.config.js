const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  snapshotPathTemplate: "tests/snapshots/{arg}{ext}",
  reporter: [["html", { open: "always" }]],
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
