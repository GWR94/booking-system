import { Booking } from '../components/interfaces/Booking.i';

const BOOKING_STORAGE_KEY = 'booking-data';

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
