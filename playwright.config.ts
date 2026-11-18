import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  timeout: 60000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:5187',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile-chromium', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
  webServer: {
    command: `${process.platform === 'win32' ? 'npm.cmd' : 'npm'} run ${process.env.TEST_PREVIEW ? 'preview' : 'dev'} -- --port 5187 --strictPort`,
    url: 'http://127.0.0.1:5187',
    reuseExistingServer: false,
    timeout: 30000,
  },
})
