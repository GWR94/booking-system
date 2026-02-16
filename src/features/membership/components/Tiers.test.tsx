import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Tiers from './Tiers';
import { ThemeProvider } from '@context';
import { useAuth } from '@hooks';
import { useSnackbar, useUI } from '@context';
import { createSubscriptionSession } from '@api';

vi.mock('@hooks', () => ({
	useAuth: vi.fn(),
}));

vi.mock('@context', async (importOriginal) => {
	const actual = (await importOriginal()) as any;
	return {
		...actual,
		useSnackbar: vi.fn(),
		useUI: vi.fn(),
	};
});

vi.mock('@api', () => ({
	createSubscriptionSession: vi.fn(),
}));

vi.mock('@components/checkout/TestPaymentNotice', () => ({
	default: () => <div data-testid="test-payment-notice" />,
}));

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
	useRouter: () => ({
		push: mockPush,
	}),
}));

describe('Tiers', () => {
	const mockShowSnackbar = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		(useAuth as any).mockReturnValue({ isAuthenticated: true, user: null });
		(useSnackbar as any).mockReturnValue({ showSnackbar: mockShowSnackbar });
		(useUI as any).mockReturnValue({ openAuthModal: vi.fn() });
	});

	it('should render all three membership tiers', () => {
		render(
			<ThemeProvider>
				<Tiers />
			</ThemeProvider>,
		);

		expect(screen.getByText('Par')).toBeInTheDocument();
		expect(screen.getByText('Birdie')).toBeInTheDocument();
		expect(screen.getByText('Hole-In-One')).toBeInTheDocument();
	});

	it('should render prices for each tier', () => {
		render(
			<ThemeProvider>
				<Tiers />
			</ThemeProvider>,
		);

		expect(screen.getByText(/£199.99\/month/i)).toBeInTheDocument();
		expect(screen.getByText(/£299.99\/month/i)).toBeInTheDocument();
		expect(screen.getByText(/£399.99\/month/i)).toBeInTheDocument();
	});

	it('should show warning and open auth modal if not authenticated', async () => {
		const mockOpenAuthModal = vi.fn();
		(useUI as any).mockReturnValue({ openAuthModal: mockOpenAuthModal });
		(useAuth as any).mockReturnValue({ isAuthenticated: false, user: null });

		render(
			<ThemeProvider>
				<Tiers />
			</ThemeProvider>,
		);

		const chooseBtn = screen.getAllByText(/Choose/i)[0];
		fireEvent.click(chooseBtn);

		await waitFor(() => {
			expect(mockShowSnackbar).toHaveBeenCalledWith(
				'You must be logged in to subscribe',
				'warning',
			);
			expect(mockOpenAuthModal).toHaveBeenCalledWith('login');
		});
	});

	it('should call createSubscriptionSession when choosing a tier', async () => {
		(createSubscriptionSession as any).mockResolvedValue({
			url: 'https://checkout.stripe.com',
		});
		delete (window as any).location;
		window.location = { href: '' } as any;

		render(
			<ThemeProvider>
				<Tiers />
			</ThemeProvider>,
		);

		const chooseBtn = screen.getAllByText(/Choose Par/i)[0];
		fireEvent.click(chooseBtn);

		await waitFor(() => {
			expect(createSubscriptionSession).toHaveBeenCalledWith('PAR');
		});
	});
});
