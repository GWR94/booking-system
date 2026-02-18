import { test, expect } from '@playwright/test';

test.describe('Site Navigation', () => {
	test('should navigate to main pages', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveURL('/');

		await page.getByRole('button', { name: /about/i }).click();
		await expect(page).toHaveURL(/\/about/);

		await page.getByRole('button', { name: /^book$/i }).click();
		await expect(page).toHaveURL(/\/book/);
	});

	test('should display 404 for invalid route', async ({ page }) => {
		await page.goto('/this-page-does-not-exist');
		// Next.js default 404 or custom not-found
		await expect(page.getByRole('heading', { name: /404|not found/i }).or(page.getByText(/page not found|404/i))).toBeVisible({ timeout: 10000 });
	});
});
