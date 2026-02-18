import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import CookiesPolicy from './CookiesPolicy';
import { useCookie } from '@context';
import createWrapper from '@utils/test-utils';

vi.mock('@context', () => ({
	useCookie: vi.fn(),
	useSnackbar: vi.fn(() => ({ showSnackbar: vi.fn() })),
}));

describe('CookiesPolicy', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		(useCookie as ReturnType<typeof vi.fn>).mockReturnValue({
			preferences: { essential: true, analytics: false, marketing: false },
			savePreferences: vi.fn(),
			acceptAll: vi.fn(),
			rejectAll: vi.fn(),
		});
	});

	it('renders Cookies Policy heading', () => {
		render(<CookiesPolicy />, { wrapper: createWrapper() });
		expect(screen.getByRole('heading', { name: /Cookies Policy/i })).toBeInTheDocument();
	});

	it('renders Last Updated text', () => {
		render(<CookiesPolicy />, { wrapper: createWrapper() });
		expect(screen.getByText(/Last Updated:/)).toBeInTheDocument();
	});

	it('renders About Cookies section', () => {
		render(<CookiesPolicy />, { wrapper: createWrapper() });
		expect(screen.getByText(/1\. About Cookies/)).toBeInTheDocument();
	});

	it('calls acceptAll and showSnackbar when Accept All is clicked', () => {
		const acceptAll = vi.fn();
		(useCookie as ReturnType<typeof vi.fn>).mockReturnValue({
			preferences: { essential: true, analytics: false, marketing: false },
			savePreferences: vi.fn(),
			acceptAll,
			rejectAll: vi.fn(),
		});
		render(<CookiesPolicy />, { wrapper: createWrapper() });
		fireEvent.click(screen.getByRole('button', { name: /Accept All/i }));
		expect(acceptAll).toHaveBeenCalled();
	});

	it('calls rejectAll when Essential Only is clicked', () => {
		const rejectAll = vi.fn();
		(useCookie as ReturnType<typeof vi.fn>).mockReturnValue({
			preferences: { essential: true, analytics: false, marketing: false },
			savePreferences: vi.fn(),
			acceptAll: vi.fn(),
			rejectAll,
		});
		render(<CookiesPolicy />, { wrapper: createWrapper() });
		fireEvent.click(screen.getByRole('button', { name: /Essential Only/i }));
		expect(rejectAll).toHaveBeenCalled();
	});
});
