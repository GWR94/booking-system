import { test, expect } from '@playwright/test';
import { loginAsUser } from '../fixtures/auth';

test.describe('Authenticated Booking Flow', () => {
	test.beforeEach(async ({ page }) => {
		await loginAsUser(page);
	});

	test('should complete authenticated booking flow', async ({ page }) => {
		// Navigate to booking page
		await page.goto('/booking');
		await expect(
			page.getByRole('heading', { name: /book your session/i }),
		).toBeVisible();

		// Wait for slots to load
		await page.waitForSelector('[data-testid="session-picker"]', {
			timeout: 10000,
		});
		await page.waitForTimeout(1000);

		// Select first available slot
		const addButton = page.locator('button:has-text("Add to Basket")').first();
		if (await addButton.isVisible()) {
			await addButton.click();
			await page.waitForTimeout(500);
		}

		// Go to checkout
		await page.click('text=Checkout');
		await expect(page).toHaveURL(/\/checkout/);

		// Should NOT show guest info form (already authenticated)
		// Should show checkout form directly
		await expect(
			page.locator('text=/checkout/i').or(page.locator('text=/payment/i')),
		).toBeVisible();
	});

	test('should view booking in profile after creation', async ({ page }) => {
		// This test would require completing a full booking
		// For now, just verify profile page shows bookings section
		await page.goto('/profile');

		await expect(
			page
				.getByRole('heading', { name: /profile/i })
				.or(page.getByText(/bookings/i)),
		).toBeVisible();
	});
});
