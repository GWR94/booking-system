import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import GoogleAnalytics from './GoogleAnalytics';
import { useCookie } from '@context';
import ReactGA from 'react-ga4';

vi.mock('@context', () => ({
	useCookie: vi.fn(),
}));

vi.mock('next/navigation', () => ({
	usePathname: () => '/',
	useSearchParams: () => ({
		toString: () => '',
	}),
}));

// Mock react-ga4 as a module with a default export
vi.mock('react-ga4', () => {
	return {
		default: {
			initialize: vi.fn(),
			send: vi.fn(),
			isInitialized: false,
		},
	};
});

describe('GoogleAnalytics', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID = 'G-TEST';
		// Reset isInitialized via the mock implementation if needed,
		// but here we just want to avoid the TypeError
		(window as any).gtag = vi.fn();
	});

	it('should initialize and send pageview when consent is granted', () => {
		(useCookie as any).mockReturnValue({
			preferences: { analytics: true },
		});

		render(<GoogleAnalytics />);

		expect(window.gtag).toHaveBeenCalledWith(
			'consent',
			'update',
			expect.anything(),
		);
		expect(ReactGA.initialize).toHaveBeenCalled();
		expect(ReactGA.send).toHaveBeenCalledWith(
			expect.objectContaining({ hitType: 'pageview' }),
		);
	});

	it('should not initialize when consent is denied', () => {
		(useCookie as any).mockReturnValue({
			preferences: { analytics: false },
		});

		render(<GoogleAnalytics />);

		expect(window.gtag).toHaveBeenCalledWith(
			'consent',
			'update',
			expect.objectContaining({ analytics_storage: 'denied' }),
		);
		expect(ReactGA.initialize).not.toHaveBeenCalled();
	});
});
