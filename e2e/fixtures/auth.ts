import { Page } from '@playwright/test';
import { TEST_USER, TEST_ADMIN } from './test-data';

/** Open auth modal from home: click account button then Login. */
const openLoginModal = async (page: Page) => {
	await page.goto('/');
	await page.getByTestId('account-button').click();
	await page.getByRole('menuitem', { name: /login/i }).click();
	// Wait for auth dialog to be visible (use heading to avoid matching both title and button)
	await page
		.getByRole('dialog')
		.getByRole('heading', { name: /sign in/i })
		.waitFor({ state: 'visible' });
};

export const loginAsUser = async (page: Page) => {
	await openLoginModal(page);
	await page.getByRole('textbox', { name: /email/i }).fill(TEST_USER.email);
	await page.getByLabel(/password/i).fill(TEST_USER.password);
	await page.getByRole('button', { name: /sign in/i }).click();
	// Modal closes when login succeeds; if it doesn't (e.g. no database), throw so callers can skip
	const closed = await page
		.getByRole('dialog')
		.waitFor({ state: 'hidden', timeout: 10000 })
		.then(() => true)
		.catch(() => false);
	if (!closed) {
		throw new Error(
			'Login did not succeed — is the database running with test user test@example.com?',
		);
	}
};

export const loginAsAdmin = async (page: Page) => {
	await openLoginModal(page);
	await page.getByRole('textbox', { name: /email/i }).fill(TEST_ADMIN.email);
	await page.getByLabel(/password/i).fill(TEST_ADMIN.password);
	await page.getByRole('button', { name: /sign in/i }).click();
	await page.getByRole('dialog').waitFor({ state: 'hidden' });
};

export const logout = async (page: Page) => {
	await page.getByTestId('account-button').click();
	await page.getByRole('menuitem', { name: /logout/i }).click();
};
