# E2E Testing with Playwright

This directory contains end-to-end tests for the booking system using Playwright.

## Setup

Playwright is already installed. To install browsers:

```bash
npx playwright install
```

## Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run in UI mode (interactive)
npm run test:e2e:ui

# Run in debug mode
npm run test:e2e:debug

# Run specific test file
npx playwright test e2e/auth/login.spec.ts

# Run tests in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Structure

```
e2e/
├── auth/
│   └── login.spec.ts              # Login and authentication tests
├── booking/
│   ├── guest-booking.spec.ts      # Guest booking flow
│   └── authenticated-booking.spec.ts  # Authenticated booking flow
├── checkout/
│   └── payment-flow.spec.ts       # Checkout and payment tests
├── navigation/
│   └── site-navigation.spec.ts    # General navigation tests
└── fixtures/
    ├── auth.ts                    # Authentication helpers
    └── test-data.ts               # Test data constants
```

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/some-page');
    await expect(page.getByRole('heading')).toBeVisible();
  });
});
```

### Using Authentication Helper

```typescript
import { loginAsUser } from '../fixtures/auth';

test.beforeEach(async ({ page }) => {
  await loginAsUser(page);
});
```

### Using Test Data

```typescript
import { TEST_USER, STRIPE_TEST_CARDS } from '../fixtures/test-data';

test('example', async ({ page }) => {
  await page.fill('input[name="email"]', TEST_USER.email);
});
```

## Test Data

### Test Users

- **Regular User**: `test@example.com` / `Test123!`
- **Admin User**: `admin@example.com` / `Admin123!`

### Stripe Test Cards

- **Success**: `4242424242424242`
- **Declined**: `4000000000000002`
- **Requires Auth**: `4000002500003155`

## Debugging

### Visual Debugging

```bash
# Run with headed browser
npx playwright test --headed

# Run with slow motion
npx playwright test --headed --slow-mo=1000

# Debug specific test
npx playwright test --debug e2e/auth/login.spec.ts
```

### Screenshots and Videos

- Screenshots are captured on failure
- Videos are recorded on first retry
- Reports are saved to `playwright-report/`

View the report:
```bash
npx playwright show-report
```

## CI/CD

Tests are configured to run in CI with:
- 2 retries on failure
- Single worker (no parallelization)
- Chromium browser only

## Best Practices

1. **Use data-testid attributes** for stable selectors
2. **Keep tests independent** - Each test should work in isolation
3. **Use page.waitFor* methods** instead of arbitrary timeouts
4. **Test user flows, not implementation**
5. **Mock external services** when appropriate
6. **Keep tests fast** - Focus on critical paths

## Troubleshooting

### Tests timing out

- Increase timeout in `playwright.config.ts`
- Check if dev server is running
- Verify backend is accessible

### Flaky tests

- Add proper wait conditions
- Use `waitForLoadState('networkidle')`
- Check for race conditions

### Element not found

- Verify selectors are correct
- Check if element is in an iframe
- Use `page.pause()` to debug

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
