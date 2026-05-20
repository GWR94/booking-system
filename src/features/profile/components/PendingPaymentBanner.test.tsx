import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PendingPaymentBanner from './PendingPaymentBanner';
import { ThemeProvider } from '@context';
import { resumePendingBookingPayment } from '@api';
import { getVitestNextRouterMocks } from '@test/vitest-next-router';

const mockShowSnackbar = vi.hoisted(() => vi.fn());

vi.mock('@context', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@context')>();
	return {
		...actual,
		useSnackbar: () => ({
			showSnackbar: mockShowSnackbar,
			hideSnackbar: vi.fn(),
			setBottomOffset: vi.fn(),
		}),
	};
});

vi.mock('@api', () => ({
	resumePendingBookingPayment: vi.fn(),
}));

describe('PendingPaymentBanner', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		getVitestNextRouterMocks().push.mockClear();
		mockShowSnackbar.mockClear();
	});

	it('renders warning and complete payment action', () => {
		render(
			<ThemeProvider>
				<PendingPaymentBanner bookingId={99} />
			</ThemeProvider>,
		);
		expect(screen.getByText(/Pending payment/i)).toBeInTheDocument();
		expect(
			screen.getByText(/booking waiting for payment/i),
		).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: /Complete Payment/i }),
		).toBeInTheDocument();
	});

	it('navigates to checkout with client secret on success', async () => {
		vi.mocked(resumePendingBookingPayment).mockResolvedValue({
			clientSecret: 'sec_test',
		} as never);

		render(
			<ThemeProvider>
				<PendingPaymentBanner bookingId={7} />
			</ThemeProvider>,
		);

		fireEvent.click(screen.getByRole('button', { name: /Complete Payment/i }));

		await waitFor(() =>
			expect(resumePendingBookingPayment).toHaveBeenCalledWith(7),
		);
		expect(getVitestNextRouterMocks().push).toHaveBeenCalledWith(
			'/checkout?payment_intent_client_secret=' + encodeURIComponent('sec_test'),
		);
	});

	it('shows snackbar when resume fails', async () => {
		const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.mocked(resumePendingBookingPayment).mockRejectedValue(new Error('nope'));

		try {
			render(
				<ThemeProvider>
					<PendingPaymentBanner bookingId={1} />
				</ThemeProvider>,
			);

			fireEvent.click(screen.getByRole('button', { name: /Complete Payment/i }));

			await waitFor(() =>
				expect(mockShowSnackbar).toHaveBeenCalledWith(
					'Unable to resume payment for this booking',
					'error',
				),
			);
		} finally {
			errSpy.mockRestore();
		}
	});
});
