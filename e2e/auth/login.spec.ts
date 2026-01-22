import { test, expect } from '@playwright/test';
import { TEST_USER } from '../fixtures/test-data';

test.describe('Login Flow', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/login');
	});

	test('should display login form', async ({ page }) => {
		await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
		await expect(page.locator('input[name="email"]')).toBeVisible();
		await expect(page.locator('input[name="password"]')).toBeVisible();
		await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
	});

	test('should login successfully with valid credentials', async ({ page }) => {
		await page.fill('input[name="email"]', TEST_USER.email);
		await page.fill('input[name="password"]', TEST_USER.password);
		await page.click('button[type="submit"]');

		// Should redirect to home page
		await expect(page).toHaveURL('/');

		// Should show user is logged in (check for account button or user name)
		await expect(page.locator('[data-testid="account-button"]')).toBeVisible();
	});

	test('should show error with invalid credentials', async ({ page }) => {
		await page.fill('input[name="email"]', 'wrong@example.com');
		await page.fill('input[name="password"]', 'wrongpassword');
		await page.click('button[type="submit"]');

		// Should show error message
		await expect(page.getByText(/unable to sign in/i)).toBeVisible();
	});

	test('should navigate to registration page', async ({ page }) => {
		await page.click('text=Sign up');
		await expect(page).toHaveURL('/register');
	});

	test('should display OAuth buttons', async ({ page }) => {
		// Check for social login buttons
		const oauthSection = page.locator('text=or').locator('..');
		await expect(oauthSection).toBeVisible();
	});
});
