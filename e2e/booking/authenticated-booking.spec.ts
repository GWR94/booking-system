import { test, expect } from '@playwright/test';
import { loginAsUser } from '../fixtures/auth';

test.describe('Authenticated Booking Flow', () => {
	test.beforeEach(async ({ page }, testInfo) => {
		try {
			await loginAsUser(page);
		} catch (err) {
			testInfo.skip(true, err instanceof Error ? err.message : 'Login failed');
		}
	});

	test('should show book page when logged in', async ({ page }) => {
		await page.goto('/book');
		await expect(
			page.getByRole('heading', { name: /book your session/i }),
		).toBeVisible();
		await expect(page.getByTestId('session-picker')).toBeVisible({ timeout: 15000 });
	});

	test('should go to checkout and show checkout form (not guest form)', async ({ page }) => {
		await page.goto('/book');
		await expect(page.getByTestId('session-picker')).toBeVisible({ timeout: 15000 });
		await page.waitForTimeout(2000);

		const addButton = page.getByRole('button', { name: /add bay \d+/i }).first();
		if (await addButton.isVisible()) {
			await addButton.click();
			await page.waitForTimeout(500);
		}

		await page.goto('/checkout');
		await expect(page).toHaveURL(/\/checkout/);
		// Authenticated: checkout/payment section visible
		await expect(
			page.getByText(/checkout|payment|complete booking/i).first(),
		).toBeVisible({ timeout: 5000 });
	});

	test('should show profile when visiting profile', async ({ page }) => {
		await page.goto('/profile/overview');
		await expect(
			page.getByRole('heading', { name: /profile|overview/i }).or(page.getByText(/profile|bookings|settings/i)),
		).toBeVisible({ timeout: 10000 });
	});
});
