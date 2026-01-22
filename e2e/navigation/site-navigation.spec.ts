import { test, expect } from '@playwright/test';

test.describe('Site Navigation', () => {
	test('should navigate to main pages', async ({ page }) => {
		await page.goto('/');

		// Home page
		await expect(page).toHaveURL('/');

		// About page
		await page.click('text=About');
		await expect(page).toHaveURL('/about');

		// Booking page
		await page.click('text=Book');
		await expect(page).toHaveURL('/booking');

		// Membership page
		await page.click('text=Membership');
		await expect(page).toHaveURL('/membership');

		// Contact page
		await page.click('text=Contact');
		await expect(page).toHaveURL('/contact');
	});

	test('should display 404 page for invalid route', async ({ page }) => {
		await page.goto('/this-page-does-not-exist');

		await expect(page.getByRole('heading', { name: /404/i })).toBeVisible();
		await expect(page.getByText(/page not found/i)).toBeVisible();
	});

	test('should navigate back from 404 page', async ({ page }) => {
		await page.goto('/');
		await page.goto('/invalid-page');

		// Click "Go Back" button
		await page.click('button:has-text("Go Back")');
		await expect(page).toHaveURL('/');
	});

	test('should navigate home from 404 page', async ({ page }) => {
		await page.goto('/invalid-page');

		// Click "Go to Home" button
		await page.click('button:has-text("Go to Home")');
		await expect(page).toHaveURL('/');
	});
});
