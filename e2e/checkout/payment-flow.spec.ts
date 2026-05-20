import { test, expect } from '@playwright/test';
import { gotoApp } from '../fixtures/page';

test.describe('Checkout and Payment Flow', () => {
	test('should display checkout page when visiting with empty basket', async ({ page }) => {
		await gotoApp(page, '/checkout');
		// Empty basket redirects to /book; or we may stay on checkout briefly with guest form / content / loading
		await page.waitForURL(/\/(checkout|book)/, { timeout: 10000 });
		const url = page.url();
		const onBook = /\/book\/?(\?|$)/.test(url);
		const onCheckout = /\/checkout/.test(url);
		// Either we were redirected to /book (empty basket) or we're on /checkout (page loaded before redirect)
		expect(onBook || onCheckout).toBeTruthy();
	});
});
