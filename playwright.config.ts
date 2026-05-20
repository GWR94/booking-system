import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;
const e2ePort = process.env.PLAYWRIGHT_PORT ?? '3001';
const baseURL = process.env.FRONT_END ?? `http://localhost:${e2ePort}`;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: './e2e',
	globalSetup: './e2e/global-setup.ts',
	fullyParallel: isCI,
	forbidOnly: isCI,
	retries: isCI ? 2 : 0,
	workers: isCI ? 1 : 1,
	timeout: 60_000,
	reporter: [
		[
			'html',
			{
				outputFolder: 'playwright/playwright-report',
				open: isCI ? 'never' : 'always',
			},
		],
	],
	outputDir: 'playwright/test-results',
	use: {
		baseURL,
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',
		actionTimeout: 15_000,
		navigationTimeout: 60_000,
	},

	projects: isCI
		? [
				{ name: 'chromium', use: { ...devices['Desktop Chrome'] } },
				{ name: 'firefox', use: { ...devices['Desktop Firefox'] } },
				{ name: 'webkit', use: { ...devices['Desktop Safari'] } },
			]
		: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

	webServer: {
		command: `npx next dev --port ${e2ePort}`,
		url: baseURL,
		reuseExistingServer: !isCI,
		timeout: 180_000,
		stdout: 'pipe',
		stderr: 'pipe',
		env: {
			...process.env,
			NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? baseURL,
		},
	},
});
