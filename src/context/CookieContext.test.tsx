import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CookieProvider, useCookie } from './CookieContext';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Helper component to interact with cookie context
const TestComponent = () => {
	const { preferences, isConsentSet, savePreferences, acceptAll, rejectAll } =
		useCookie();
	return (
		<div>
			<div data-testid="essential">{String(preferences.essential)}</div>
			<div data-testid="functional">{String(preferences.functional)}</div>
			<div data-testid="analytics">{String(preferences.analytics)}</div>
			<div data-testid="marketing">{String(preferences.marketing)}</div>
			<div data-testid="consent-set">{String(isConsentSet)}</div>
			<button onClick={acceptAll}>Accept All</button>
			<button onClick={rejectAll}>Reject All</button>
			<button
				onClick={() =>
					savePreferences({
						essential: true,
						functional: true,
						analytics: false,
						marketing: false,
					})
				}
			>
				Save Custom
			</button>
		</div>
	);
};

// Error boundary helper
const ErrorTester = () => {
	useCookie();
	return null;
};

describe('CookieContext', () => {
	beforeEach(() => {
		localStorage.clear();
		vi.clearAllMocks();
	});

	afterEach(() => {
		localStorage.clear();
	});

	it('should initialize with default preferences when no stored data', () => {
		render(
			<CookieProvider>
				<TestComponent />
			</CookieProvider>,
		);

		expect(screen.getByTestId('essential')).toHaveTextContent('true');
		expect(screen.getByTestId('functional')).toHaveTextContent('false');
		expect(screen.getByTestId('analytics')).toHaveTextContent('false');
		expect(screen.getByTestId('marketing')).toHaveTextContent('false');
		expect(screen.getByTestId('consent-set')).toHaveTextContent('false');
	});

	it('should load stored preferences from localStorage', () => {
		const storedPrefs = {
			essential: true,
			functional: true,
			analytics: true,
			marketing: false,
		};
		localStorage.setItem('cookie_preferences', JSON.stringify(storedPrefs));

		render(
			<CookieProvider>
				<TestComponent />
			</CookieProvider>,
		);

		expect(screen.getByTestId('essential')).toHaveTextContent('true');
		expect(screen.getByTestId('functional')).toHaveTextContent('true');
		expect(screen.getByTestId('analytics')).toHaveTextContent('true');
		expect(screen.getByTestId('marketing')).toHaveTextContent('false');
		expect(screen.getByTestId('consent-set')).toHaveTextContent('true');
	});

	it('should handle corrupted localStorage data gracefully', () => {
		const consoleErrorSpy = vi.spyOn(console, 'error');
		consoleErrorSpy.mockImplementation(() => {});

		localStorage.setItem('cookie_preferences', 'invalid-json{');

		render(
			<CookieProvider>
				<TestComponent />
			</CookieProvider>,
		);

		// Should fall back to defaults
		expect(screen.getByTestId('essential')).toHaveTextContent('true');
		expect(screen.getByTestId('functional')).toHaveTextContent('false');
		expect(screen.getByTestId('analytics')).toHaveTextContent('false');
		expect(screen.getByTestId('marketing')).toHaveTextContent('false');
		expect(screen.getByTestId('consent-set')).toHaveTextContent('false');

		expect(consoleErrorSpy).toHaveBeenCalledWith(
			'Failed to parse cookie preferences',
			expect.any(Error),
		);

		consoleErrorSpy.mockRestore();
	});

	it('should save preferences and ensure essential is always true', async () => {
		const user = userEvent.setup();
		render(
			<CookieProvider>
				<TestComponent />
			</CookieProvider>,
		);

		await user.click(screen.getByText('Save Custom'));

		await waitFor(() => {
			expect(screen.getByTestId('functional')).toHaveTextContent('true');
		});

		expect(screen.getByTestId('essential')).toHaveTextContent('true');
		expect(screen.getByTestId('analytics')).toHaveTextContent('false');
		expect(screen.getByTestId('marketing')).toHaveTextContent('false');
		expect(screen.getByTestId('consent-set')).toHaveTextContent('true');

		const stored = JSON.parse(
			localStorage.getItem('cookie_preferences') || '{}',
		);
		expect(stored.essential).toBe(true);
		expect(stored.functional).toBe(true);
	});

	it('should accept all cookies', async () => {
		const user = userEvent.setup();
		render(
			<CookieProvider>
				<TestComponent />
			</CookieProvider>,
		);

		await user.click(screen.getByText('Accept All'));

		await waitFor(() => {
			expect(screen.getByTestId('functional')).toHaveTextContent('true');
		});

		expect(screen.getByTestId('essential')).toHaveTextContent('true');
		expect(screen.getByTestId('analytics')).toHaveTextContent('true');
		expect(screen.getByTestId('marketing')).toHaveTextContent('true');
		expect(screen.getByTestId('consent-set')).toHaveTextContent('true');

		const stored = JSON.parse(
			localStorage.getItem('cookie_preferences') || '{}',
		);
		expect(stored).toEqual({
			essential: true,
			functional: true,
			analytics: true,
			marketing: true,
		});
	});

	it('should reject all non-essential cookies', async () => {
		const user = userEvent.setup();
		render(
			<CookieProvider>
				<TestComponent />
			</CookieProvider>,
		);

		await user.click(screen.getByText('Reject All'));

		await waitFor(() => {
			expect(screen.getByTestId('consent-set')).toHaveTextContent('true');
		});

		expect(screen.getByTestId('essential')).toHaveTextContent('true');
		expect(screen.getByTestId('functional')).toHaveTextContent('false');
		expect(screen.getByTestId('analytics')).toHaveTextContent('false');
		expect(screen.getByTestId('marketing')).toHaveTextContent('false');

		const stored = JSON.parse(
			localStorage.getItem('cookie_preferences') || '{}',
		);
		expect(stored).toEqual({
			essential: true,
			functional: false,
			analytics: false,
			marketing: false,
		});
	});

	it('should throw error when used outside provider', () => {
		const consoleSpy = vi.spyOn(console, 'error');
		consoleSpy.mockImplementation(() => {});

		expect(() => render(<ErrorTester />)).toThrow(
			'useCookie must be used within a CookieProvider',
		);

		consoleSpy.mockRestore();
	});
});
