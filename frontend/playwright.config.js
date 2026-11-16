import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  timeout: 120000,
  workers: 1,
  use: { baseURL: process.env.E2E_BASE_URL || "http://127.0.0.1:8000", locale: "ru-RU", reducedMotion: "reduce" },
  webServer: process.env.E2E_BASE_URL ? undefined : {
    command: "python -m uvicorn app.main:app --host 127.0.0.1 --port 8000",
    cwd: "../backend",
    url: "http://127.0.0.1:8000/api/healthz",
    reuseExistingServer: !process.env.CI,
  },
});
