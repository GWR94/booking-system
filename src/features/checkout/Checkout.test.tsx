import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import Checkout from './Checkout';

const mockUseBasket = vi.fn();
const mockUseAuth = vi.fn();
const mockShowSnackbar = vi.fn();
const mockCreatePaymentIntent = vi.fn();
const mockCreateGuestPaymentIntent = vi.fn();

vi.mock('@hooks', () => ({
	useBasket: () => mockUseBasket(),
	useAuth: () => mockUseAuth(),
	useBookingManager: () => ({ booking: null }),
}));

vi.mock('@context', () => ({
	useSnackbar: () => ({ showSnackbar: mockShowSnackbar }),
}));

vi.mock('@api', () => ({
	createPaymentIntent: (...args: any[]) => mockCreatePaymentIntent(...args),
	createGuestPaymentIntent: (...args: any[]) =>
		mockCreateGuestPaymentIntent(...args),
}));

vi.mock('./components', () => ({
	CompleteBooking: () => <div>Complete Booking Component</div>,
	CheckoutForm: ({ guest, isFree }: any) => (
		<div>
			Checkout Form Component
			{guest && <span>Guest: {guest.email}</span>}
			{isFree && <span>Free Booking</span>}
		</div>
	),
	GuestUser: () => <div>Guest User Component</div>,
	GuestInfo: ({ onSubmit }: any) => (
		<div>
			Guest Info Component
			<button onClick={() => onSubmit({ email: 'guest@test.com' }, 'token')}>
				Submit Guest
			</button>
		</div>
	),
	CheckoutSkeleton: () => <div>Checkout Skeleton</div>,
}));

vi.mock('@ui', () => ({
	LoadingSpinner: () => <div>Loading Spinner</div>,
	SectionHeader: () => <div>Section Header</div>,
	AnimateIn: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@stripe/react-stripe-js', () => ({
	Elements: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('next/navigation', () => ({
	useRouter: () => ({
		push: vi.fn(),
		replace: vi.fn(),
	}),
	usePathname: () => '/checkout',
	useSearchParams: () => ({
		get: vi.fn((key) => null),
	}),
}));

describe('Checkout Page', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseBasket.mockReturnValue({ basket: [] });
		mockUseAuth.mockReturnValue({ isAuthenticated: false });
	});

	it('shows GuestInfo when user is not authenticated and no guest info', () => {
		mockUseBasket.mockReturnValue({ basket: [{ id: 1 }] });
		mockUseAuth.mockReturnValue({ isAuthenticated: false });

		render(<Checkout />);

		expect(screen.getByText('Guest Info Component')).toBeInTheDocument();
	});

	it('shows loading spinner when fetching payment intent', async () => {
		mockUseBasket.mockReturnValue({ basket: [{ id: 1 }] });
		mockUseAuth.mockReturnValue({ isAuthenticated: true });
		mockCreatePaymentIntent.mockImplementation(
			() => new Promise(() => {}), // Never resolves to keep loading
		);

		render(<Checkout />);

		await waitFor(() => {
			expect(screen.getByText('Checkout Skeleton')).toBeInTheDocument();
		});
	});

	it('shows CheckoutForm for free booking', async () => {
		mockUseBasket.mockReturnValue({ basket: [{ id: 1 }] });
		mockUseAuth.mockReturnValue({ isAuthenticated: true });
		mockCreatePaymentIntent.mockResolvedValue({
			clientSecret: null,
			amount: 0,
		});

		render(<Checkout />);

		await waitFor(() => {
			expect(screen.getByText('Checkout Form Component')).toBeInTheDocument();
			expect(screen.getByText('Free Booking')).toBeInTheDocument();
		});
	});

	it('shows CheckoutForm with Stripe Elements for paid booking', async () => {
		mockUseBasket.mockReturnValue({ basket: [{ id: 1 }] });
		mockUseAuth.mockReturnValue({ isAuthenticated: true });
		mockCreatePaymentIntent.mockResolvedValue({
			clientSecret: 'test_secret',
			amount: 100,
		});

		render(<Checkout />);

		await waitFor(() => {
			expect(screen.getByText('Checkout Form Component')).toBeInTheDocument();
		});
	});

	it('handles guest payment intent creation', async () => {
		mockUseBasket.mockReturnValue({ basket: [{ id: 1 }] });
		mockUseAuth.mockReturnValue({ isAuthenticated: false });
		mockCreateGuestPaymentIntent.mockResolvedValue({
			clientSecret: 'guest_secret',
			amount: 100,
		});

		render(<Checkout />);

		const submitButton = screen.getByRole('button', { name: /Submit Guest/i });
		submitButton.click();

		await waitFor(() => {
			expect(mockCreateGuestPaymentIntent).toHaveBeenCalledWith(
				[{ id: 1 }],
				{ email: 'guest@test.com' },
				'token',
			);
		});
	});
});
