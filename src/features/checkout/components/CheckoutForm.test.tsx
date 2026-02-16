import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import CheckoutForm from './CheckoutForm';
import { useAuth, useBasket } from '@hooks';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { confirmFreeBooking } from '@api';
import createWrapper from '@utils/test-utils';
import { ThemeProvider, createTheme } from '@mui/material';

vi.mock('@hooks', () => ({
	useAuth: vi.fn(),
	useBasket: vi.fn(),
	useBookingManager: vi.fn(() => ({ setBooking: vi.fn() })),
}));

vi.mock('@context', () => ({
	useSnackbar: vi.fn(() => ({ showSnackbar: vi.fn() })),
	ThemeProvider: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@mui/icons-material', () => ({
	Lock: () => <div data-testid="LockIcon" />,
}));

vi.mock('@ui', () => ({
	AnimateIn: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="animate-in">{children}</div>
	),
}));

vi.mock('@stripe/react-stripe-js', () => ({
	useStripe: vi.fn(),
	useElements: vi.fn(),
	PaymentElement: () => <div data-testid="payment-element" />,
}));

vi.mock('@api', () => ({
	confirmFreeBooking: vi.fn(),
}));

// Mock sub-components
vi.mock('./CheckoutItem', () => ({
	default: ({ slot }: any) => (
		<div data-testid="mock-checkout-item">Item {slot.id}</div>
	),
}));

vi.mock('./TestPaymentNotice', () => ({
	default: () => <div data-testid="mock-payment-notice">Notice</div>,
}));

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
	useRouter: () => ({
		push: mockPush,
	}),
}));

const theme = createTheme();

describe('CheckoutForm', () => {
	const mockStripe = {
		confirmPayment: vi.fn(),
	};
	const mockElements = {};
	const mockBasket = [
		{
			id: '1',
			slotIds: ['slot1'],
			startTime: '2024-01-20T10:00:00Z',
			endTime: '2024-01-20T11:00:00Z',
			bayId: 1,
			price: '45.00',
		},
	];

	beforeEach(() => {
		vi.clearAllMocks();
		(useStripe as any).mockReturnValue(mockStripe);
		(useElements as any).mockReturnValue(mockElements);
		(useAuth as any).mockReturnValue({
			user: {
				name: 'Test User',
				email: 'test@example.com',
				membershipTier: 'NONE',
				membershipUsage: null,
			},
			isAuthenticated: true,
		});
		(useBasket as any).mockReturnValue({
			basket: mockBasket,
			basketPrice: '45.00',
			removeFromBasket: vi.fn(),
			clearBasket: vi.fn(),
		});
	});

	it('should render basic structure', async () => {
		render(
			<ThemeProvider theme={theme}>
				<CheckoutForm guest={null} />
			</ThemeProvider>,
			{ wrapper: createWrapper() },
		);

		expect(screen.getByText(/Order Summary/i)).toBeInTheDocument();
		expect(screen.getByText(/Subtotal/i)).toBeInTheDocument();
		expect(screen.getByText(/VAT/i)).toBeInTheDocument();
		// Button also contains the total
		expect(
			screen.getByRole('button', { name: /Pay £45/i }),
		).toBeInTheDocument();
		expect(screen.getByTestId('mock-checkout-item')).toBeInTheDocument();
		expect(screen.getByTestId('mock-payment-notice')).toBeInTheDocument();
		expect(screen.getByTestId('payment-element')).toBeInTheDocument();
	});

	it('should handle successful payment submission', async () => {
		mockStripe.confirmPayment.mockResolvedValue({ error: null });
		render(
			<ThemeProvider theme={theme}>
				<CheckoutForm guest={null} />
			</ThemeProvider>,
			{ wrapper: createWrapper() },
		);

		const payButton = screen.getByRole('button', { name: /Pay/i });
		fireEvent.submit(payButton.closest('form')!);

		await waitFor(() => {
			expect(mockStripe.confirmPayment).toHaveBeenCalled();
		});
	});

	it('should handle payment error', async () => {
		mockStripe.confirmPayment.mockResolvedValue({
			error: { type: 'card_error', message: 'Insufficient funds' },
		});
		render(
			<ThemeProvider theme={theme}>
				<CheckoutForm guest={null} />
			</ThemeProvider>,
			{ wrapper: createWrapper() },
		);

		const payButton = screen.getByRole('button', { name: /Pay/i });
		fireEvent.submit(payButton.closest('form')!);

		expect(await screen.findByText('Insufficient funds')).toBeInTheDocument();
	});

	it('should handle free booking submission', async () => {
		(confirmFreeBooking as any).mockResolvedValue({
			success: true,
			booking: { id: 'booking1' },
		});

		render(
			<ThemeProvider theme={theme}>
				<CheckoutForm guest={null} isFree={true} />
			</ThemeProvider>,
			{ wrapper: createWrapper() },
		);

		const payButton = screen.getByRole('button', { name: /Pay/i });
		fireEvent.submit(payButton.closest('form')!);

		await waitFor(() => {
			expect(confirmFreeBooking).toHaveBeenCalled();
			expect(mockPush).toHaveBeenCalledWith('/checkout/complete?success=true');
		});
	});

	it('should show membership warning for PAR tier on weekends', async () => {
		(useAuth as any).mockReturnValue({
			user: {
				name: 'Par User',
				email: 'par@example.com',
				membershipTier: 'PAR',
			},
			isAuthenticated: true,
		});

		render(
			<ThemeProvider theme={theme}>
				<CheckoutForm guest={null} />
			</ThemeProvider>,
			{ wrapper: createWrapper() },
		);

		expect(
			await screen.findByText(
				/Weekend slots are excluded from Par membership/i,
			),
		).toBeInTheDocument();
	});

	it('should show membership allowance section for members', async () => {
		(useAuth as any).mockReturnValue({
			user: {
				name: 'Gold User',
				email: 'gold@example.com',
				membershipTier: 'HOLEINONE',
				membershipUsage: {
					usedHours: 0,
					totalHours: 15,
					remainingHours: 15,
				},
				bookings: [],
				currentPeriodStart: new Date(),
				currentPeriodEnd: new Date(),
			},
			isAuthenticated: true,
		});

		render(
			<ThemeProvider theme={theme}>
				<CheckoutForm guest={null} />
			</ThemeProvider>,
			{ wrapper: createWrapper() },
		);

		expect(
			await screen.findByText(/Membership Allowance/i),
		).toBeInTheDocument();
		expect(await screen.findByText(/15 hrs/i)).toBeInTheDocument();
	});
});
