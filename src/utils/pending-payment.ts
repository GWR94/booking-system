import dayjs from 'dayjs';

type BookingLike = {
	id: number;
	status?: string | null;
	paymentId?: string | null;
	bookingTime?: string | Date | null;
	slots?: Array<{ endTime?: string | Date | null }>;
};

export const isResumablePendingBooking = (
	booking: BookingLike,
	now = dayjs(),
): boolean => {
	if (booking.status !== 'pending') return false;
	if (!booking.paymentId) return false;
	if (!booking.slots || booking.slots.length === 0) return false;

	const lastEndTime = booking.slots[booking.slots.length - 1]?.endTime;
	if (!lastEndTime) return false;
	return dayjs(lastEndTime).isAfter(now);
};

export const getLatestResumablePendingBooking = <T extends BookingLike>(
	bookings: T[] | undefined,
	now = dayjs(),
): T | null => {
	if (!bookings || bookings.length === 0) return null;
	return (
		[...bookings]
			.filter((booking) => isResumablePendingBooking(booking, now))
			.sort((a, b) => dayjs(b.bookingTime).unix() - dayjs(a.bookingTime).unix())[0] ??
		null
	);
};

