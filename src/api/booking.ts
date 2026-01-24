import { axios } from '@utils';
import type { GuestUser } from '@pages/checkout/components';
import type { Booking, GroupedSlot } from '@pages/booking/components';

const BOOKING_STORAGE_KEY = 'booking-data';

export const createBooking = async (slotIds: number[]) => {
	const response = await axios.post('/api/bookings', { slotIds });
	return response.data;
};

export const deleteBooking = async (bookingId: number) => {
	const response = await axios.delete(`/api/bookings/${bookingId}`);
	return response.data;
};

export const createPaymentIntent = async (items: GroupedSlot[]) => {
	const response = await axios.post('/api/bookings/create-payment-intent', {
		items,
	});
	return response.data;
};

export const createGuestPaymentIntent = async (
	items: GroupedSlot[],
	guestInfo: GuestUser,
	recaptchaToken: string,
) => {
	const response = await axios.post(
		'/api/bookings/guest/create-payment-intent',
		{
			items,
			guestInfo,
			recaptchaToken,
		},
	);
	return response.data;
};

export const getBookingByPaymentIntent = async (paymentIntentId: string) => {
	const response = await axios.get(`/api/bookings/payment/${paymentIntentId}`);
	return response.data;
};

export const confirmFreeBooking = async (
	slotIds: number[],
	guestInfo?: GuestUser | null,
) => {
	const endpoint = guestInfo ? '/api/bookings/guest' : '/api/bookings';
	const response = await axios.post(endpoint, {
		slotIds,
		paymentId: 'FREE_MEMBERSHIP',
		paymentStatus: 'succeeded',
		guestInfo,
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
