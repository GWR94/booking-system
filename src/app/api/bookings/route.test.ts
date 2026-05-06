import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMockRequest, parseResponse } from '@test/api-test-utils';

const mockAuth = vi.fn();
const mockCreatePendingBooking = vi.fn();

vi.mock('../../../auth', () => ({
	auth: (...args: unknown[]) => mockAuth(...args),
}));

// Ensure route.ts never touches real BookingService/prisma during unit tests.
vi.mock('@/server/modules/bookings/booking.service', () => ({
	BookingService: {},
}));

vi.mock('@/server/modules/booking-lifecycle/booking/booking-lifecycle', () => ({
	makeBookingLifecycle: () => ({
		createPendingBooking: (...args: unknown[]) => mockCreatePendingBooking(...args),
	}),
}));

import { POST } from './route';

describe('POST /api/bookings', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should create booking for authenticated user', async () => {
		mockAuth.mockResolvedValue({ user: { id: '1' } });
		mockCreatePendingBooking.mockResolvedValue({
			ok: true,
			booking: { id: 100, status: 'pending', slots: [{ id: 10 }] },
		});

		const req = createMockRequest({
			method: 'POST',
			body: { slotIds: [10, 11] },
		});

		const response = await POST(req);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(200);
		expect(body.message).toBe('Booking created successfully');
		expect(mockCreatePendingBooking).toHaveBeenCalledWith({
			userId: 1,
			slotIds: [10, 11],
			paymentId: undefined,
			paymentStatus: undefined,
			guestInfo: undefined,
		});
	});

	it('should create guest booking with guestInfo', async () => {
		mockAuth.mockResolvedValue(null);

		const guestInfo = {
			name: 'Guest User',
			email: 'guest@example.com',
			phone: '07700900000',
		};

		mockCreatePendingBooking.mockResolvedValue({
			ok: true,
			booking: { id: 101, status: 'pending', slots: [{ id: 10 }] },
		});

		const req = createMockRequest({
			method: 'POST',
			body: {
				slotIds: [10, 11],
				guestInfo,
				paymentId: 'FREE_MEMBERSHIP',
				paymentStatus: 'succeeded',
			},
		});

		const response = await POST(req);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(200);
		expect(body.message).toBe('Guest booking created successfully');
		expect(body.guestEmail).toBe('guest@example.com');
		expect(mockCreatePendingBooking).toHaveBeenCalledWith({
			userId: undefined,
			slotIds: [10, 11],
			paymentId: 'FREE_MEMBERSHIP',
			paymentStatus: 'succeeded',
			guestInfo,
		});
	});

	it('should return 401 when no auth and no guestInfo', async () => {
		mockAuth.mockResolvedValue(null);

		const req = createMockRequest({
			method: 'POST',
			body: { slotIds: [10, 11] },
		});

		const response = await POST(req);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(401);
		expect(body.code).toBe('AUTH_REQUIRED');
	});

	it('should return 500 when lifecycle returns a failure result', async () => {
		mockAuth.mockResolvedValue({ user: { id: '1' } });
		mockCreatePendingBooking.mockResolvedValue({
			ok: false,
			error: 'slots do not exist',
		});

		const req = createMockRequest({
			method: 'POST',
			body: { slotIds: [999] },
		});

		const response = await POST(req);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(500);
		expect(body.error).toBe('slots do not exist');
	});
});