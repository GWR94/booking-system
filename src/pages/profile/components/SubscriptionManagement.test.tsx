import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SubscriptionManagement from './SubscriptionManagement';
import { createPortalSession } from '@api';
import { ThemeProvider } from '@context';

vi.mock('@api', () => ({
	createPortalSession: vi.fn(),
}));

describe('SubscriptionManagement', () => {
	const mockUserNoSub = {
		membershipTier: null,
	};

	const mockUserSub = {
		membershipTier: 'HOLEINONE',
		membershipStatus: 'active',
		currentPeriodEnd: '2026-12-31T23:59:59Z',
	};

	beforeEach(() => {
		vi.clearAllMocks();
		// Partially mock window.location.href
		delete (window as any).location;
		window.location = { href: '' } as any;
	});

	it('should render unsubscribed state', () => {
		render(
			<ThemeProvider>
				<SubscriptionManagement user={mockUserNoSub} />
			</ThemeProvider>,
		);

		expect(
			screen.getByText(/You are not currently subscribed to any plan/i),
		).toBeInTheDocument();
		expect(screen.getByText(/View Plans/i)).toBeInTheDocument();
	});

	it('should render subscribed state correctly', () => {
		render(
			<ThemeProvider>
				<SubscriptionManagement user={mockUserSub} />
			</ThemeProvider>,
		);

		expect(screen.getByText(/Membership Details/i)).toBeInTheDocument();
		expect(screen.getByText(/ACTIVE/i)).toBeInTheDocument();
		expect(screen.getByText(/Hole-In-One/i)).toBeInTheDocument();
		expect(screen.getByText(/December 31, 2026/i)).toBeInTheDocument();
	});

	it('should redirect to portal when Manage Subscription is clicked', async () => {
		(createPortalSession as any).mockResolvedValue({
			url: 'https://billing.stripe.com/p/session',
		});

		render(
			<ThemeProvider>
				<SubscriptionManagement user={mockUserSub} />
			</ThemeProvider>,
		);

		fireEvent.click(screen.getByText(/Manage Subscription/i));

		expect(createPortalSession).toHaveBeenCalled();
		await waitFor(() => {
			expect(window.location.href).toBe('https://billing.stripe.com/p/session');
		});
	});

	it('should show error message on portal redirection failure', async () => {
		(createPortalSession as any).mockRejectedValue(new Error('Failed'));

		render(
			<ThemeProvider>
				<SubscriptionManagement user={mockUserSub} />
			</ThemeProvider>,
		);

		fireEvent.click(screen.getByText(/Manage Subscription/i));

		expect(
			await screen.findByText(/Failed to redirect to subscription portal/i),
		).toBeInTheDocument();
	});
});
