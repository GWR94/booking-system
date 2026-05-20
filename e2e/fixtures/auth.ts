import { Page } from '@playwright/test';
import { TEST_USER, TEST_ADMIN } from './test-data';
import { gotoApp, expectLoggedIn } from './page';

/** Open auth modal from home: click account button then Login. */
const openLoginModal = async (page: Page) => {
	await gotoApp(page, '/');
	await page.getByTestId('account-button').click();
	await page.getByRole('menuitem', { name: /login/i }).click();
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
	try {
		await expectLoggedIn(page);
	} catch {
		throw new Error(
			'Login did not succeed — run `npm run setup:dev` and ensure DATABASE_URL is set.',
		);
	}
};

export const loginAsAdmin = async (page: Page) => {
	await openLoginModal(page);
	await page.getByRole('textbox', { name: /email/i }).fill(TEST_ADMIN.email);
	await page.getByLabel(/password/i).fill(TEST_ADMIN.password);
	await page.getByRole('button', { name: /sign in/i }).click();
	await expectLoggedIn(page);
};

export const logout = async (page: Page) => {
	await page.getByTestId('account-button').click();
	await page.getByRole('menuitem', { name: /logout/i }).click();
};
