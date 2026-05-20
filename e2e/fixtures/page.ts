import { Page, expect } from '@playwright/test';

const COOKIE_PREFS = {
	essential: true,
	functional: true,
	analytics: true,
	marketing: true,
};

/** Hide cookie banner before first paint on each navigation. */
export const installCookieConsent = async (page: Page) => {
	await page.addInitScript((prefs) => {
		localStorage.setItem('cookie_preferences', JSON.stringify(prefs));
	}, COOKIE_PREFS);
};

/** Wait until NextAuth API routes respond with JSON (dev server compile can return HTML first). */
export const waitForAuthApi = async (page: Page) => {
	await expect(async () => {
		const response = await page.request.get('/api/auth/session');
		expect(response.ok()).toBeTruthy();
		expect(response.headers()['content-type'] ?? '').toContain('application/json');
	}).toPass({ timeout: 30_000 });
};

/** Navigate with cookie consent pre-set and a lighter load event than default `load`. */
export const gotoApp = async (page: Page, path = '/') => {
	await installCookieConsent(page);
	await page.goto(path, { waitUntil: 'domcontentloaded' });
	await waitForAuthApi(page);
	await page.waitForLoadState('networkidle').catch(() => undefined);
};

/** Returns true when the account menu shows Logout (credentials sign-in succeeded). */
export const expectLoggedIn = async (page: Page, timeout = 15_000) => {
	await page.getByTestId('account-button').click();
	await expect(page.getByRole('menuitem', { name: /logout/i })).toBeVisible({
		timeout,
	});
};