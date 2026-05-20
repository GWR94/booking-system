import { test, expect } from '@playwright/test';
import { gotoApp } from '../fixtures/page';

test.describe('Site Navigation', () => {
	test('should navigate to main pages', async ({ page }) => {
		await gotoApp(page, '/');
		await expect(page).toHaveURL('/');

		await page.getByRole('button', { name: /^join$/i }).click();
		await expect(page).toHaveURL(/\/membership/);

		await gotoApp(page, '/');
		await page.getByRole('button', { name: /^book$/i }).click();
		await expect(page).toHaveURL(/\/book/);

		await gotoApp(page, '/');
		await page.getByRole('button', { name: /^about$/i }).click();
		await expect(page).toHaveURL(/\/about/);
	});

	test('should display 404 for invalid route', async ({ page }) => {
		await gotoApp(page, '/this-page-does-not-exist');
		await expect(page.getByRole('heading', { name: '404' })).toBeVisible({
			timeout: 10000,
		});
	});
});
