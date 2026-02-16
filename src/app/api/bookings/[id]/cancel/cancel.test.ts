import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockGetSessionUser } = vi.hoisted(() => ({
	mockGetSessionUser: vi.fn(),
}));

const { mockDb } = vi.hoisted(() => ({
	mockDb: {
		booking: { findUnique: vi.fn(), update: vi.fn() },
		slot: { updateMany: vi.fn() },
	},
}));

const { mockStripe } = vi.hoisted(() => ({
	mockStripe: {
		refunds: { create: vi.fn() },
	},
}));

vi.mock('@db', () => ({
	db: mockDb,
}));

vi.mock('src/server/auth/auth', () => ({
	getSessionUser: mockGetSessionUser,
}));


vi.mock('@lib/stripe', () => ({
	getStripe: vi.fn(() => mockStripe),
}));

import { POST } from './route';
import { createMockRequest } from '@test/api-test-utils';

describe('POST /api/bookings/[id]/cancel', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should cancel booking and refund if > 24h notice', async () => {
		const mockUser = { id: 1, role: 'user' };
		const mockBooking = {
			id: 1,
			userId: 1,
			paymentId: 'pi_123',
			slots: [
				{
					startTime: new Date(Date.now() + 48 * 3600000).toISOString(),
					id: 10,
				},
			],
		};

		mockGetSessionUser.mockResolvedValue(mockUser);
		mockDb.booking.findUnique.mockResolvedValue(mockBooking);
		mockDb.slot.updateMany.mockResolvedValue({ count: 1 });
		mockDb.booking.update.mockResolvedValue({
			...mockBooking,
			status: 'cancelled',
		});

		const req = createMockRequest({ method: 'POST' });
		const response = await POST(req, {
			params: Promise.resolve({ id: '1' }),
		});

		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data.refundStatus).toBe('refunded');
		expect(mockStripe.refunds.create).toHaveBeenCalled();
	});

	it('should cancel booking without refund if < 24h notice', async () => {
		const mockUser = { id: 1, role: 'user' };
		const mockBooking = {
			id: 1,
			userId: 1,
			paymentId: 'pi_123',
			slots: [
				{
					startTime: new Date(Date.now() + 2 * 3600000).toISOString(),
					id: 10,
				},
			],
		};

		mockGetSessionUser.mockResolvedValue(mockUser);
		mockDb.booking.findUnique.mockResolvedValue(mockBooking);

		const req = createMockRequest({ method: 'POST' });
		const response = await POST(req, {
			params: Promise.resolve({ id: '1' }),
		});

		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data.refundStatus).toBe('not_refunded_policy');
		expect(mockStripe.refunds.create).not.toHaveBeenCalled();
	});
});
