import { Page } from '@playwright/test';
import { TEST_USER, TEST_ADMIN } from './test-data';

export async function loginAsUser(page: Page) {
	await page.goto('/login');
	await page.fill('input[name="email"]', TEST_USER.email);
	await page.fill('input[name="password"]', TEST_USER.password);
	await page.click('button[type="submit"]');
	await page.waitForURL('/');
}

export async function loginAsAdmin(page: Page) {
	await page.goto('/login');
	await page.fill('input[name="email"]', TEST_ADMIN.email);
	await page.fill('input[name="password"]', TEST_ADMIN.password);
	await page.click('button[type="submit"]');
	await page.waitForURL('/');
}

export async function logout(page: Page) {
	// Click account button
	await page.click('[data-testid="account-button"]');
	// Click logout
	await page.click('text=Logout');
	await page.waitForURL('/');
}
