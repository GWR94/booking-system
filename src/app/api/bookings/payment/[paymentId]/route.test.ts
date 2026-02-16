import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockRequest, createMockParams, parseResponse } from '@test/api-test-utils';

vi.mock('@db', () => ({
	db: {
		booking: {
			findFirst: vi.fn(),
		},
	},
}));

vi.mock('@utils/slots', () => ({
	groupSlotsByBay: vi.fn().mockReturnValue([]),
}));

import { GET } from './route';
import { db } from '@db';

describe('GET /api/bookings/payment/[paymentId]', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should return booking by payment ID', async () => {
		const mockBooking = {
			id: 1,
			paymentId: 'pi_abc123',
			status: 'confirmed',
			slots: [],
			user: { name: 'Test', email: 'test@example.com' },
		};
		(db.booking.findFirst as any).mockResolvedValue(mockBooking);

		const req = createMockRequest({});
		const params = createMockParams({ paymentId: 'pi_abc123' });
		const response = await GET(req, params);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(200);
		expect(body.booking).toEqual(mockBooking);
		expect(db.booking.findFirst).toHaveBeenCalledWith({
			where: { paymentId: 'pi_abc123' },
			include: {
				slots: { include: { bay: true } },
				user: true,
			},
		});
	});

	it('should return 404 when booking not found', async () => {
		(db.booking.findFirst as any).mockResolvedValue(null);

		const req = createMockRequest({});
		const params = createMockParams({ paymentId: 'pi_invalid' });
		const response = await GET(req, params);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(404);
		expect(body.message).toBe('Booking not found');
	});
});
