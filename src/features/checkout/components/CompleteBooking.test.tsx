import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import CompletePage from './CompleteBooking';
import { loadStripe } from '@stripe/stripe-js';
import { axios } from '@api/client';
import createWrapper from '@utils/test-utils';
import { useBasket, useBookingManager, useSession } from '@hooks';

vi.mock('@stripe/stripe-js', () => ({
	loadStripe: vi.fn(),
}));

vi.mock('@api/client', () => ({
	axios: {
		get: vi.fn(),
	},
}));

vi.mock('@hooks', () => ({
	useBasket: vi.fn(),
	useBookingManager: vi.fn(),
	useSession: vi.fn(),
	useAuth: vi.fn(() => ({
		user: null,
		isAdmin: false,
	})),
}));

vi.mock('next/navigation', () => ({
	useRouter: () => ({
		push: vi.fn(),
	}),
	useSearchParams: vi.fn(() => ({
		get: vi.fn((key) => {
			if (key === 'payment_intent_client_secret') return 'pi_123_secret_456';
			if (key === 'success') return 'false';
			return null;
		}),
	})),
}));

describe('CompletePage Polling Logic', () => {
	const mockStripe = {
		retrievePaymentIntent: vi.fn(),
	};
	const mockClearBasket = vi.fn();
	const mockSetBooking = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		(loadStripe as any).mockResolvedValue(mockStripe);
		(useBasket as any).mockReturnValue({
			clearBasket: mockClearBasket,
			removeFromBasket: vi.fn(),
		});
		(useBookingManager as any).mockReturnValue({
			booking: null,
			setBooking: mockSetBooking,
		});
		(useSession as any).mockReturnValue({
			selectedDate: null,
		});
	});

	afterEach(() => {
		vi.resetModules();
	});

	it('fetches booking successfully on first try', async () => {
		mockStripe.retrievePaymentIntent.mockResolvedValue({
			paymentIntent: {
				id: 'pi_123',
				status: 'succeeded',
				amount: 2000,
				payment_method_types: ['card'],
			},
		});

		(axios.get as any).mockResolvedValue({
			data: {
				booking: {
					id: 1,
					status: 'confirmed',
					slots: [
						{
							id: 10,
							startTime: '2023-01-01T10:00:00Z',
							endTime: '2023-01-01T10:55:00Z',
							bayId: 1,
						},
					],
				},
				groupedSlots: [
					{
						// Only used as a truthy flag in the component
						bogus: true,
					},
				],
			},
		});

		render(<CompletePage />, { wrapper: createWrapper() });

		await waitFor(() => {
			expect(axios.get).toHaveBeenCalledTimes(1);
			expect(mockSetBooking).toHaveBeenCalledWith(
				expect.objectContaining({
					id: 1,
					status: 'confirmed',
				}),
			);
			expect(mockClearBasket).toHaveBeenCalled();
		});
	});

	it('retries fetching booking on failure and succeeds eventually', async () => {
		mockStripe.retrievePaymentIntent.mockResolvedValue({
			paymentIntent: {
				id: 'pi_123',
				status: 'succeeded',
				amount: 2000,
				payment_method_types: ['card'],
			},
		});

		// Fail twice, then succeed
		(axios.get as any)
			.mockRejectedValueOnce(new Error('Not found'))
			.mockRejectedValueOnce(new Error('Not found'))
			.mockResolvedValue({
				data: {
					booking: {
						id: 1,
						status: 'confirmed',
						slots: [
							{
								id: 10,
								startTime: '2023-01-01T10:00:00Z',
								endTime: '2023-01-01T10:55:00Z',
								bayId: 1,
							},
						],
					},
					groupedSlots: [
						{
							bogus: true,
						},
					],
				},
			});

		render(<CompletePage />, { wrapper: createWrapper() });

		await waitFor(
			() => {
				expect(axios.get).toHaveBeenCalledTimes(3);
				expect(mockSetBooking).toHaveBeenCalledWith(
					expect.objectContaining({
						id: 1,
						status: 'confirmed',
					}),
				);
			},
			{ timeout: 10000 },
		); // Increase timeout to account for polling delays
	}, 15000);

	it('stops retrying after max attempts', async () => {
		mockStripe.retrievePaymentIntent.mockResolvedValue({
			paymentIntent: {
				id: 'pi_123',
				status: 'succeeded',
				amount: 2000,
				payment_method_types: ['card'],
			},
		});

		// Always fail
		(axios.get as any).mockRejectedValue(new Error('Not found'));

		render(<CompletePage />, { wrapper: createWrapper() });

		await waitFor(
			() => {
				expect(axios.get).toHaveBeenCalledTimes(6); // Initial + 5 retries
			},
			{ timeout: 15000 },
		);

		expect(mockSetBooking).not.toHaveBeenCalled();
	}, 20000);
});
