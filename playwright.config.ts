import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    webServer: {
        command: 'npm run dev -- --port 3000',
        port: 3000,
        reuseExistingServer: !process.env.CI,
    },
});
