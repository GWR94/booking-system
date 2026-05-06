import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeAdminBookingLifecycle } from './admin-booking-lifecycle';

describe('admin-booking-lifecycle', () => {
	const adminBookingsService = {
		getAllBookings: vi.fn(),
		extendBooking: vi.fn(),
		checkBookingExtendAvailability: vi.fn(),
		updateBookingStatus: vi.fn(),
		deleteBooking: vi.fn(),
		createAdminBooking: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('extendBooking maps Booking not found to 404', async () => {
		adminBookingsService.extendBooking.mockRejectedValue(new Error('Booking not found'));
		const lifecycle = makeAdminBookingLifecycle({ adminBookingsService });

		const res = await lifecycle.extendBooking({
			user: { role: 'admin' },
			bookingId: 1,
			hours: 1,
		});
		expect(res.ok).toBe(false);
		if (!res.ok) {
			expect(res.status).toBe(404);
			expect(res.message).toBe('Booking not found');
			expect(res.code).toBe('NOT_FOUND');
		}
	});

	it('checkBookingExtendAvailability maps Booking not found to 404', async () => {
		adminBookingsService.checkBookingExtendAvailability.mockRejectedValue(
			new Error('Booking not found'),
		);
		const lifecycle = makeAdminBookingLifecycle({ adminBookingsService });

		const res = await lifecycle.checkBookingExtendAvailability({
			user: { role: 'admin' },
			bookingId: 1,
		});
		expect(res.ok).toBe(false);
		if (!res.ok) {
			expect(res.status).toBe(404);
			expect(res.message).toBe('Booking not found');
		}
	});

	it('createLocalBooking maps not available to SLOT_NOT_AVAILABLE', async () => {
		adminBookingsService.createAdminBooking.mockRejectedValue(
			new Error("The following slots are not available or don't exist: 1"),
		);
		const lifecycle = makeAdminBookingLifecycle({ adminBookingsService });

		const res = await lifecycle.createLocalBooking({
			user: { role: 'admin' },
			userId: 1,
			slotIds: [1],
		});
		expect(res.ok).toBe(false);
		if (!res.ok) {
			expect(res.status).toBe(400);
			expect(res.code).toBe('SLOT_NOT_AVAILABLE');
		}
	});

	it('getAllBookings maps service error to 500', async () => {
		adminBookingsService.getAllBookings.mockRejectedValue(new Error('DB error'));
		const lifecycle = makeAdminBookingLifecycle({ adminBookingsService } as any);

		const res = await lifecycle.getAllBookings({
			user: { role: 'admin' },
			page: 1,
			limit: 10,
			search: null,
		});

		expect(res.ok).toBe(false);
		if (!res.ok) {
			expect(res.status).toBe(500);
			expect(res.message).toBe('DB error');
		}
	});

	it('deleteBooking maps Booking not found to 404 + NOT_FOUND', async () => {
		adminBookingsService.deleteBooking.mockRejectedValue(
			new Error('Booking not found'),
		);
		const lifecycle = makeAdminBookingLifecycle({ adminBookingsService } as any);

		const res = await lifecycle.deleteBooking({
			user: { role: 'admin' },
			bookingId: 1,
		});

		expect(res.ok).toBe(false);
		if (!res.ok) {
			expect(res.status).toBe(404);
			expect(res.code).toBe('NOT_FOUND');
		}
	});
});

