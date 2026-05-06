import type {
	AdminBookingsServiceLike,
	AdminBookingLifecycle,
} from './types';

export type { AdminBookingsServiceLike, AdminBookingLifecycle } from './types';

export function makeAdminBookingLifecycle(deps: {
	adminBookingsService: AdminBookingsServiceLike;
}): AdminBookingLifecycle {
	const { adminBookingsService } = deps;

	return {
		async getAllBookings({ user, page, limit, search }) {
			if (user.role !== 'admin') {
				return { ok: false, status: 403, message: 'Forbidden' };
			}
			try {
				const value = await adminBookingsService.getAllBookings({
					page,
					limit,
					search,
				});
				return { ok: true, value };
			} catch (err: unknown) {
				const message =
					err instanceof Error ? err.message : 'Internal Server Error';
				return { ok: false, status: 500, message };
			}
		},

		async extendBooking({ user, bookingId, hours }) {
			if (user.role !== 'admin') {
				return { ok: false, status: 403, message: 'Forbidden' };
			}
			try {
				const value = await adminBookingsService.extendBooking(bookingId, hours);
				return { ok: true, value };
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : 'Internal Server Error';
				if (message === 'Booking not found') {
					return { ok: false, status: 404, message, code: 'NOT_FOUND' };
				}
				return { ok: false, status: 500, message };
			}
		},

		async checkBookingExtendAvailability({ user, bookingId }) {
			if (user.role !== 'admin') {
				return { ok: false, status: 403, message: 'Forbidden' };
			}
			try {
				const value = await adminBookingsService.checkBookingExtendAvailability(bookingId);
				return { ok: true, value };
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : 'Internal Server Error';
				if (message === 'Booking not found') {
					return { ok: false, status: 404, message };
				}
				return { ok: false, status: 500, message };
			}
		},

		async updateBookingStatus({ user, bookingId, status }) {
			if (user.role !== 'admin') {
				return { ok: false, status: 403, message: 'Forbidden' };
			}
			try {
				const value = await adminBookingsService.updateBookingStatus(bookingId, status);
				return { ok: true, value };
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : 'Internal Server Error';
				return { ok: false, status: 500, message };
			}
		},

		async deleteBooking({ user, bookingId }) {
			if (user.role !== 'admin') {
				return { ok: false, status: 403, message: 'Forbidden' };
			}
			try {
				const value = await adminBookingsService.deleteBooking(bookingId);
				return { ok: true, value };
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : 'Internal Server Error';
				if (message === 'Booking not found') {
					return { ok: false, status: 404, message, code: 'NOT_FOUND' };
				}
				return { ok: false, status: 500, message };
			}
		},

		async createLocalBooking({ user, userId, slotIds }) {
			if (user.role !== 'admin') {
				return { ok: false, status: 403, message: 'Forbidden' };
			}
			try {
				const value = await adminBookingsService.createAdminBooking(userId, slotIds);
				return { ok: true, value };
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : 'Internal Server Error';
				if (message.toLowerCase().includes('not available')) {
					return { ok: false, status: 400, message, code: 'SLOT_NOT_AVAILABLE' };
				}
				return { ok: false, status: 500, message };
			}
		},
	};
}

