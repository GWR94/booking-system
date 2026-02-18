import { test, expect } from '@playwright/test';

test.describe('Guest Booking Flow', () => {
	test('should show book page and session picker', async ({ page }) => {
		await page.goto('/book');
		await expect(
			page.getByRole('heading', { name: /book your session/i }),
		).toBeVisible();

		await expect(page.getByTestId('session-picker')).toBeVisible({ timeout: 15000 });
	});

	test('should add slot to basket and go to checkout', async ({ page }) => {
		await page.goto('/book');

		await expect(page.getByTestId('session-picker')).toBeVisible({ timeout: 15000 });
		// Wait for slots to load (loading spinner to disappear)
		await page.waitForTimeout(2000);

		// Slot buttons are "Add Bay 1", "Add Bay 2", etc.
		const addButton = page.getByRole('button', { name: /add bay \d+/i }).first();
		await expect(addButton).toBeVisible({ timeout: 15000 });
		await addButton.click();

		// Navigate to checkout (basket has item)
		await page.goto('/checkout');
		await expect(page).toHaveURL(/\/checkout/);
		// Guest flow: should show guest info or contact information (use first() to avoid strict mode when both match)
		await expect(
			page.getByRole('heading', { name: /contact information/i }).or(page.locator('input[name="name"]')).first(),
		).toBeVisible({ timeout: 5000 });
	});
});
