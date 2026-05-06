import { axios } from '@api/client';
import type { GuestUser } from '@features/checkout/components';
import type { Booking, GroupedSlot } from '@features/booking/components';
import type { CheckoutIdentityMode } from '@features/checkout/checkout-contract';

const BOOKING_STORAGE_KEY = 'booking-data';

export const createBooking = async (slotIds: number[]) => {
	const response = await axios.post('/api/bookings', { slotIds });
	return response.data;
};

export const deleteBooking = async (bookingId: number) => {
	const response = await axios.post(`/api/bookings/${bookingId}/cancel`);
	return response.data;
};

export const resumePendingBookingPayment = async (bookingId: number) => {
	const response = await axios.post(`/api/bookings/${bookingId}/resume-payment`);
	return response.data as { clientSecret: string; paymentIntentId: string };
};

export const createPaymentIntent = async (items: GroupedSlot[]) => {
	const identityMode: CheckoutIdentityMode = 'authenticated';
	const response = await axios.post('/api/bookings/payment-intent', {
		items,
		identityMode,
	});
	return response.data;
};

export const createGuestPaymentIntent = async (
	items: GroupedSlot[],
	guestInfo: GuestUser,
	recaptchaToken: string,
) => {
	const identityMode: CheckoutIdentityMode = 'guest';
	const response = await axios.post('/api/bookings/payment-intent', {
		items,
		guestInfo,
		recaptchaToken,
		identityMode,
	});
	return response.data;
};

export const getBookingByPaymentIntent = async (paymentIntentId: string) => {
	const response = await axios.get(`/api/bookings/payment/${paymentIntentId}`);
	return response.data;
};

export const confirmFreeBooking = async (
	slotIds: number[],
	guestInfo?: GuestUser,
) => {
	const response = await axios.post('/api/bookings', {
		slotIds,
		paymentId: 'FREE_MEMBERSHIP',
		paymentStatus: 'succeeded',
		guestInfo,
		identityMode: guestInfo ? 'guest' : 'authenticated',
	});
	return response.data;
};
export const getStoredBooking = (): Booking | null => {
	const saved = localStorage.getItem(BOOKING_STORAGE_KEY);
	return saved ? JSON.parse(saved) : null;
};

export const saveStoredBooking = (booking: Booking | null): Booking | null => {
	if (booking) {
		localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(booking));
	} else {
		localStorage.removeItem(BOOKING_STORAGE_KEY);
	}
	return booking;
};
