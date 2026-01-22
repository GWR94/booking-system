import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CookieConsentBanner from './CookieConsentBanner';
import { useCookie } from '@context';
import { ThemeProvider, createTheme } from '@mui/material';

vi.mock('@context', () => ({
	useCookie: vi.fn(),
}));

const theme = createTheme();

describe('CookieConsentBanner', () => {
	const mockAcceptAll = vi.fn();
	const mockRejectAll = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should not render when consent is already set', () => {
		(useCookie as any).mockReturnValue({
			isConsentSet: true,
			acceptAll: mockAcceptAll,
			rejectAll: mockRejectAll,
		});

		render(
			<ThemeProvider theme={theme}>
				<CookieConsentBanner />
			</ThemeProvider>,
		);

		expect(
			screen.queryByText(/We respect your privacy/i),
		).not.toBeInTheDocument();
	});

	it('should render when consent is not set', () => {
		(useCookie as any).mockReturnValue({
			isConsentSet: false,
			acceptAll: mockAcceptAll,
			rejectAll: mockRejectAll,
		});

		render(
			<ThemeProvider theme={theme}>
				<CookieConsentBanner />
			</ThemeProvider>,
		);

		expect(screen.getByText(/We respect your privacy/i)).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /Accept/i })).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: /Decline/i }),
		).toBeInTheDocument();
	});

	it('should call acceptAll when Accept is clicked', () => {
		(useCookie as any).mockReturnValue({
			isConsentSet: false,
			acceptAll: mockAcceptAll,
			rejectAll: mockRejectAll,
		});

		render(
			<ThemeProvider theme={theme}>
				<CookieConsentBanner />
			</ThemeProvider>,
		);

		fireEvent.click(screen.getByRole('button', { name: /Accept/i }));
		expect(mockAcceptAll).toHaveBeenCalled();
	});

	it('should call rejectAll when Decline is clicked', () => {
		(useCookie as any).mockReturnValue({
			isConsentSet: false,
			acceptAll: mockAcceptAll,
			rejectAll: mockRejectAll,
		});

		render(
			<ThemeProvider theme={theme}>
				<CookieConsentBanner />
			</ThemeProvider>,
		);

		fireEvent.click(screen.getByRole('button', { name: /Decline/i }));
		expect(mockRejectAll).toHaveBeenCalled();
	});
});
