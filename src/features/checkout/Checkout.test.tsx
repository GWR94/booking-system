import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Checkout from './Checkout';

const mockUseBasket = vi.fn();
const mockUseAuth = vi.fn();
const mockShowSnackbar = vi.fn();
const mockLogout = vi.fn();
const mockCreatePaymentIntent = vi.fn();
const mockCreateGuestPaymentIntent = vi.fn();
const mockResumePendingBookingPayment = vi.fn();
const mockPush = vi.fn();
const mockReplace = vi.fn();
const mockSearchParamsGet = vi.fn();

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
	resumePendingBookingPayment: (...args: any[]) =>
		mockResumePendingBookingPayment(...args),
	STORAGE_KEYS: { BASKET: 'booking-basket' },
	getBasket: vi.fn(() => []),
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
		push: mockPush,
		replace: mockReplace,
	}),
	usePathname: () => '/checkout',
	useSearchParams: () => ({
		get: mockSearchParamsGet,
	}),
}));

describe('Checkout Page', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockLogout.mockResolvedValue(undefined);
		mockUseBasket.mockReturnValue({ basket: [], basketPrice: '0.00', isBasketFetched: true });
		mockUseAuth.mockReturnValue({
			isAuthenticated: false,
			isLoading: false,
			logout: mockLogout,
			user: null,
		});
		mockSearchParamsGet.mockImplementation(() => null);
	});

	it('shows GuestInfo when user is not authenticated and no guest info', () => {
		mockUseBasket.mockReturnValue({ basket: [{ id: 1 }] });
		mockUseAuth.mockReturnValue({
			isAuthenticated: false,
			isLoading: false,
			logout: mockLogout,
			user: null,
		});

		render(<Checkout />);

		expect(screen.getByText('Guest Info Component')).toBeInTheDocument();
		expect(mockReplace).not.toHaveBeenCalled();
	});

	it('shows loading spinner when fetching payment intent', async () => {
		mockUseBasket.mockReturnValue({ basket: [{ id: 1 }] });
		mockUseAuth.mockReturnValue({
			isAuthenticated: true,
			isLoading: false,
			logout: mockLogout,
			user: null,
		});
		mockCreatePaymentIntent.mockImplementation(
			() => new Promise(() => {}), // Never resolves to keep loading
		);

		render(<Checkout />);

		await waitFor(() => {
			expect(screen.getByText('Checkout Skeleton')).toBeInTheDocument();
		});
	});

	it('does not get stuck on skeleton when authenticated user is refreshing auth', async () => {
		mockUseBasket.mockReturnValue({ basket: [{ id: 1 }] });
		mockUseAuth.mockReturnValue({
			isAuthenticated: true,
			isLoading: true,
			logout: mockLogout,
			user: null,
		});
		mockCreatePaymentIntent.mockResolvedValue({
			clientSecret: 'refreshing_auth_secret',
			amount: 100,
		});

		render(<Checkout />);

		await waitFor(() => {
			expect(mockCreatePaymentIntent).toHaveBeenCalled();
		});
		await waitFor(() => {
			expect(screen.getByText('Checkout Form Component')).toBeInTheDocument();
		});
	});

	it('shows CheckoutForm for free booking', async () => {
		mockUseBasket.mockReturnValue({ basket: [{ id: 1 }] });
		mockUseAuth.mockReturnValue({
			isAuthenticated: true,
			isLoading: false,
			logout: mockLogout,
			user: null,
		});
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
		mockUseAuth.mockReturnValue({
			isAuthenticated: true,
			isLoading: false,
			logout: mockLogout,
		});
		mockCreatePaymentIntent.mockResolvedValue({
			clientSecret: 'test_secret',
			amount: 100,
		});

		render(<Checkout />);

		await waitFor(() => {
			expect(screen.getByText('Checkout Form Component')).toBeInTheDocument();
		});
		expect(mockReplace).not.toHaveBeenCalled();
	});

	it('handles guest payment intent creation', async () => {
		mockUseBasket.mockReturnValue({ basket: [{ id: 1 }] });
		mockUseAuth.mockReturnValue({
			isAuthenticated: false,
			isLoading: false,
			logout: mockLogout,
			user: null,
		});
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

	it('redirects to /book when authenticated user has an empty basket', async () => {
		mockUseBasket.mockReturnValue({ basket: [], basketPrice: '0.00', isBasketFetched: true });
		mockUseAuth.mockReturnValue({
			isAuthenticated: true,
			isLoading: false,
			logout: mockLogout,
			user: null,
		});

		render(<Checkout />);

		await waitFor(() => {
			expect(mockReplace).toHaveBeenCalledWith('/book');
		});
	});

	it('redirects to /book when basket becomes empty after having items', async () => {
		mockUseAuth.mockReturnValue({
			isAuthenticated: false,
			isLoading: false,
			logout: mockLogout,
			user: null,
		});
		mockUseBasket.mockReturnValue({
			basket: [{ id: 1 }],
			basketPrice: '12.00',
			isBasketFetched: true,
		});

		const { rerender } = render(<Checkout />);
		expect(mockReplace).not.toHaveBeenCalled();

		mockUseBasket.mockReturnValue({
			basket: [],
			basketPrice: '0.00',
			isBasketFetched: true,
		});
		rerender(<Checkout />);

		await waitFor(() => {
			expect(mockReplace).toHaveBeenCalledWith('/book');
		});
	});

	it('does not redirect when returning from Stripe', async () => {
		mockUseBasket.mockReturnValue({ basket: [], basketPrice: '0.00', isBasketFetched: true });
		mockUseAuth.mockReturnValue({
			isAuthenticated: true,
			isLoading: false,
			logout: mockLogout,
			user: null,
		});
		mockSearchParamsGet.mockImplementation((key) => {
			if (key === 'payment_intent_client_secret') return 'secret';
			return null;
		});

		render(<Checkout />);

		await waitFor(() => {
			expect(mockReplace).not.toHaveBeenCalled();
		});
	});

	it('redirects via persisted basket fallback before hydration completes when empty', async () => {
		mockUseBasket.mockReturnValue({
			basket: [],
			basketPrice: '0.00',
			isBasketFetched: false,
		});
		mockUseAuth.mockReturnValue({
			isAuthenticated: false,
			isLoading: false,
			logout: mockLogout,
			user: null,
		});

		render(<Checkout />);

		await waitFor(() => {
			expect(mockReplace).toHaveBeenCalledWith('/book');
		});
	});

	it('does not show GuestInfo while auth is loading', () => {
		mockUseBasket.mockReturnValue({ basket: [{ id: 1 }] });
		mockUseAuth.mockReturnValue({
			isAuthenticated: false,
			isLoading: true,
			logout: mockLogout,
			user: null,
		});

		render(<Checkout />);

		expect(screen.getByText('Checkout Skeleton')).toBeInTheDocument();
		expect(screen.queryByText('Guest Info Component')).not.toBeInTheDocument();
	});

	it('does not logout user and shows retry state on 401 intent error', async () => {
		mockUseBasket.mockReturnValue({ basket: [{ id: 1 }] });
		mockUseAuth.mockReturnValue({
			isAuthenticated: true,
			isLoading: false,
			logout: mockLogout,
			user: null,
		});
		mockCreatePaymentIntent.mockRejectedValue({ response: { status: 401 } });

		render(<Checkout />);

		await waitFor(() => {
			expect(screen.getByText('Unable to start checkout')).toBeInTheDocument();
		});
		expect(mockLogout).not.toHaveBeenCalled();
		expect(screen.queryByText('Guest Info Component')).not.toBeInTheDocument();
	});

	it('redirects to /book when basket is empty even if user has pending booking', async () => {
		mockUseBasket.mockReturnValue({ basket: [], basketPrice: '0.00', isBasketFetched: true });
		mockUseAuth.mockReturnValue({
			isAuthenticated: true,
			isLoading: false,
			logout: mockLogout,
			user: {
				bookings: [
					{
						id: 99,
						status: 'pending',
						paymentId: 'pi_test_1',
						bookingTime: new Date().toISOString(),
						slots: [{ endTime: new Date(Date.now() + 60_000).toISOString() }],
					},
				],
			},
		});

		render(<Checkout />);

		await waitFor(() => {
			expect(mockReplace).toHaveBeenCalledWith('/book');
		});
	});
});
