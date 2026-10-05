import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  use: {
    baseURL: "http://localhost:4100",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "api",
      use: { baseURL: "http://localhost:3000" },
      testMatch:
        /(duplicate-email|empty-title-article|unauthenticated-favorite|authz-bola|idempotency-favorite|security-headers)\.spec\.ts/,
    },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testMatch: /(happy-path|invalid-login)\.spec\.ts/,
    },
  ],

  webServer: [
    {
      command: "npm start",
      cwd: "../backend",
      url: "http://localhost:3000/api/articles",
      timeout: 60 * 1000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "npm start",
      cwd: "../frontend",
      url: "http://localhost:4100",
      timeout: 60 * 1000,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
