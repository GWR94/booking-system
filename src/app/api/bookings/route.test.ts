import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockRequest, parseResponse } from '@test/api-test-utils';

const mockAuth = vi.fn();
const mockCreateBooking = vi.fn();

vi.mock('../../../auth', () => ({
	auth: (...args: any[]) => mockAuth(...args),
}));

vi.mock('src/server/modules/bookings/booking.service', () => ({
	BookingService: {
		createBooking: (...args: any[]) => mockCreateBooking(...args),
	},
}));

import { POST } from './route';

describe('POST /api/bookings', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should create booking for authenticated user', async () => {
		mockAuth.mockResolvedValue({
			user: { id: '1', email: 'user@example.com', role: 'user' },
		});
		mockCreateBooking.mockResolvedValue({
			id: 100,
			userId: 1,
			status: 'pending',
			slots: [{ id: 10 }],
		});

		const req = createMockRequest({
			method: 'POST',
			body: { slotIds: [10, 11] },
		});

		const response = await POST(req);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(200);
		expect(body.message).toBe('Booking created successfully');
		expect(mockCreateBooking).toHaveBeenCalledWith({
			userId: 1,
			slotIds: [10, 11],
			paymentId: undefined,
			paymentStatus: undefined,
			guestInfo: undefined,
		});
	});

	it('should create guest booking with guestInfo', async () => {
		mockAuth.mockResolvedValue(null); // Not authenticated

		const guestInfo = {
			name: 'Guest User',
			email: 'guest@example.com',
			phone: '07700900000',
		};

		mockCreateBooking.mockResolvedValue({
			id: 101,
			status: 'pending',
			slots: [{ id: 10 }],
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
		expect(mockCreateBooking).toHaveBeenCalledWith({
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
		expect(body.error).toContain('Authentication required');
	});

	it('should prioritise guestInfo when both auth and guestInfo provided', async () => {
		// Edge case: authenticated user creating a booking with guest info
		// (e.g. admin creating on behalf of guest)
		mockAuth.mockResolvedValue({
			user: { id: '1', email: 'admin@example.com', role: 'admin' },
		});

		const guestInfo = {
			name: 'Guest',
			email: 'guest@example.com',
		};

		mockCreateBooking.mockResolvedValue({ id: 102, status: 'pending' });

		const req = createMockRequest({
			method: 'POST',
			body: { slotIds: [10], guestInfo },
		});

		const response = await POST(req);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(200);
		// Both userId and guestInfo should be passed; service handles priority
		expect(mockCreateBooking).toHaveBeenCalledWith(
			expect.objectContaining({
				userId: 1,
				guestInfo,
			}),
		);
	});

	it('should return 500 on service error', async () => {
		mockAuth.mockResolvedValue({
			user: { id: '1', email: 'user@example.com', role: 'user' },
		});
		mockCreateBooking.mockRejectedValue(
			new Error('One or more slots do not exist or have been booked'),
		);

		const req = createMockRequest({
			method: 'POST',
			body: { slotIds: [999] },
		});

		const response = await POST(req);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(500);
		expect(body.error).toContain('slots do not exist');
	});
});
