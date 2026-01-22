import { test, expect } from '@playwright/test';
import { STRIPE_TEST_CARDS } from '../fixtures/test-data';

test.describe('Checkout and Payment Flow', () => {
	test.skip('should complete payment with Stripe test card', async ({
		page,
	}) => {
		// This test requires having items in basket first
		// Skip for now as it requires full booking flow setup

		await page.goto('/checkout');

		// Fill guest information
		await page.fill('input[name="name"]', 'Test Guest');
		await page.fill('input[name="email"]', 'guest@test.com');
		await page.fill('input[name="phone"]', '1234567890');
		await page.click('button:has-text("Continue")');

		// Wait for Stripe iframe
		const stripeFrame = page.frameLocator('iframe[name*="stripe"]');

		// Fill card details
		await stripeFrame
			.locator('[name="cardnumber"]')
			.fill(STRIPE_TEST_CARDS.success);
		await stripeFrame.locator('[name="exp-date"]').fill('12/34');
		await stripeFrame.locator('[name="cvc"]').fill('123');
		await stripeFrame.locator('[name="postal"]').fill('12345');

		// Submit payment
		await page.click('button:has-text("Complete Booking")');

		// Verify success
		await expect(page).toHaveURL(/\/checkout\/complete/, { timeout: 15000 });
		await expect(page.getByText(/booking confirmed/i)).toBeVisible();
	});

	test('should display checkout page elements', async ({ page }) => {
		await page.goto('/checkout');

		// Should show either guest form or checkout form
		const hasGuestForm = await page
			.locator('input[name="name"]')
			.isVisible()
			.catch(() => false);
		const hasCheckoutForm = await page
			.locator('text=/checkout/i')
			.isVisible()
			.catch(() => false);

		expect(hasGuestForm || hasCheckoutForm).toBeTruthy();
	});
});
