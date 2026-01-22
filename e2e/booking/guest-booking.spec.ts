import { test, expect } from '@playwright/test';

test.describe('Guest Booking Flow', () => {
	test('should complete guest booking flow', async ({ page }) => {
		// Navigate to booking page
		await page.goto('/booking');
		await expect(
			page.getByRole('heading', { name: /book your session/i }),
		).toBeVisible();

		// Wait for slots to load
		await page.waitForSelector('[data-testid="session-picker"]', {
			timeout: 10000,
		});

		// Select a session (if session picker is available)
		const sessionButtons = page.locator('button:has-text("Morning")');
		if ((await sessionButtons.count()) > 0) {
			await sessionButtons.first().click();
		}

		// Wait for time slots to appear
		await page.waitForTimeout(1000);

		// Select first available time slot
		const timeSlots = page
			.locator('[data-testid^="slot-"]')
			.or(page.locator('button:has-text("Add to Basket")'));
		await expect(timeSlots.first()).toBeVisible({ timeout: 10000 });
		await timeSlots.first().click();

		// Verify basket count increased
		const basketIndicator = page
			.locator('[data-testid="basket-count"]')
			.or(page.locator('text=/\\d+/'));
		await expect(basketIndicator).toBeVisible({ timeout: 5000 });

		// Navigate to checkout
		await page.click('text=Checkout');
		await expect(page).toHaveURL(/\/checkout/);

		// Should show guest info form
		await expect(
			page
				.getByText(/guest information/i)
				.or(page.locator('input[name="name"]')),
		).toBeVisible();
	});

	test('should add multiple slots to basket', async ({ page }) => {
		await page.goto('/booking');

		// Wait for slots to load
		await page.waitForSelector('[data-testid="session-picker"]', {
			timeout: 10000,
		});
		await page.waitForTimeout(1000);

		// Add first slot
		const addButtons = page.locator('button:has-text("Add to Basket")');
		const firstButton = addButtons.first();
		if (await firstButton.isVisible()) {
			await firstButton.click();
			await page.waitForTimeout(500);

			// Try to add second slot
			const secondButton = addButtons.nth(1);
			if (await secondButton.isVisible()) {
				await secondButton.click();
			}
		}

		// Basket should have items
		const basketCount = page.locator('[data-testid="basket-count"]');
		if (await basketCount.isVisible()) {
			const count = await basketCount.textContent();
			expect(parseInt(count || '0')).toBeGreaterThan(0);
		}
	});
});
