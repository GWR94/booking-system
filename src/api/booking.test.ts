import { describe, it, expect, vi, beforeEach } from 'vitest';
import { axios } from '@api/client';
import {
	createBooking,
	deleteBooking,
	createPaymentIntent,
	createGuestPaymentIntent,
	getBookingByPaymentIntent,
	confirmFreeBooking,
	getStoredBooking,
	saveStoredBooking,
} from './booking';

vi.mock('@api/client', () => ({
	axios: {
		get: vi.fn(),
		post: vi.fn(),
		delete: vi.fn(),
	},
}));

describe('booking api', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		localStorage.clear();
	});

	it('createBooking should call POST /api/bookings', async () => {
		const slotIds = [1];
		const mockResponse = { id: 123 };
		(axios.post as any).mockResolvedValue({ data: mockResponse });

		const result = await createBooking(slotIds);

		expect(axios.post).toHaveBeenCalledWith('/api/bookings', { slotIds });
		expect(result).toEqual(mockResponse);
	});

	it('deleteBooking should call POST /api/bookings/:id/cancel', async () => {
		const bookingId = 123;
		const mockResponse = { success: true };
		(axios.post as any).mockResolvedValue({ data: mockResponse });

		const result = await deleteBooking(bookingId);

		expect(axios.post).toHaveBeenCalledWith(
			`/api/bookings/${bookingId}/cancel`,
		);
		expect(result).toEqual(mockResponse);
	});

	it('createPaymentIntent should call POST /api/bookings/payment-intent', async () => {
		const items = [{ id: 1 }] as any;
		const mockResponse = { clientSecret: 'secret' };
		(axios.post as any).mockResolvedValue({ data: mockResponse });

		const result = await createPaymentIntent(items);

		expect(axios.post).toHaveBeenCalledWith('/api/bookings/payment-intent', {
			items,
		});
		expect(result).toEqual(mockResponse);
	});

	it('createGuestPaymentIntent should call POST /api/bookings/payment-intent', async () => {
		const items = [{ id: 1 }] as any;
		const guestInfo = { name: 'Guest', email: 'guest@test.com' };
		const recaptchaToken = 'token';
		const mockResponse = { clientSecret: 'secret' };
		(axios.post as any).mockResolvedValue({ data: mockResponse });

		const result = await createGuestPaymentIntent(
			items,
			guestInfo,
			recaptchaToken,
		);

		expect(axios.post).toHaveBeenCalledWith('/api/bookings/payment-intent', {
			items,
			guestInfo,
			recaptchaToken,
		});
		expect(result).toEqual(mockResponse);
	});

	it('getBookingByPaymentIntent should call GET /api/bookings/payment/:id', async () => {
		const paymentIntentId = 'pi_123';
		const mockResponse = { id: 123 };
		(axios.get as any).mockResolvedValue({ data: mockResponse });

		const result = await getBookingByPaymentIntent(paymentIntentId);

		expect(axios.get).toHaveBeenCalledWith(
			`/api/bookings/payment/${paymentIntentId}`,
		);
		expect(result).toEqual(mockResponse);
	});

	describe('confirmFreeBooking', () => {
		it('should call POST /api/bookings for logged in user', async () => {
			const slotIds = [1];
			const mockResponse = { id: 123 };
			(axios.post as any).mockResolvedValue({ data: mockResponse });

			const result = await confirmFreeBooking(slotIds);

			expect(axios.post).toHaveBeenCalledWith('/api/bookings', {
				slotIds,
				paymentId: 'FREE_MEMBERSHIP',
				paymentStatus: 'succeeded',
				guestInfo: undefined,
			});
			expect(result).toEqual(mockResponse);
		});

		it('should call POST /api/bookings for guest', async () => {
			const slotIds = [1];
			const guestInfo = { name: 'Guest', email: 'guest@test.com' };
			const mockResponse = { id: 123 };
			(axios.post as any).mockResolvedValue({ data: mockResponse });

			const result = await confirmFreeBooking(slotIds, guestInfo);

			expect(axios.post).toHaveBeenCalledWith('/api/bookings', {
				slotIds,
				paymentId: 'FREE_MEMBERSHIP',
				paymentStatus: 'succeeded',
				guestInfo,
			});
			expect(result).toEqual(mockResponse);
		});
	});

	it('getStoredBooking should return null if nothing in localStorage', () => {
		expect(getStoredBooking()).toBeNull();
	});

	it('getStoredBooking should return parsed data from localStorage', () => {
		const mockBooking = { id: 123 };
		localStorage.setItem('booking-data', JSON.stringify(mockBooking));
		expect(getStoredBooking()).toEqual(mockBooking);
	});

	it('saveStoredBooking should save data and return it', () => {
		const mockBooking = { id: 123 } as any;
		const result = saveStoredBooking(mockBooking);
		expect(localStorage.getItem('booking-data')).toEqual(
			JSON.stringify(mockBooking),
		);
		expect(result).toEqual(mockBooking);
	});

	it('saveStoredBooking should remove data if null passed', () => {
		localStorage.setItem('booking-data', 'test');
		const result = saveStoredBooking(null);
		expect(localStorage.getItem('booking-data')).toBeNull();
		expect(result).toBeNull();
	});
});
