import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockRequest, parseResponse } from '@test/api-test-utils';

vi.mock('@db', () => ({
	db: {
		booking: {
			findMany: vi.fn(),
			update: vi.fn(),
		},
		slot: {
			updateMany: vi.fn(),
		},
	},
}));

import { GET } from './route';
import { db } from '@db';

describe('GET /api/cron/cleanup-bookings', () => {
	const CRON_SECRET = 'test-cron-secret';

	beforeEach(() => {
		vi.clearAllMocks();
		process.env.CRON_SECRET = CRON_SECRET;
	});

	it('should clean up stale bookings', async () => {
		const staleBookings = [
			{
				id: 1,
				status: 'pending',
				slots: [{ id: 10 }, { id: 11 }],
			},
			{
				id: 2,
				status: 'pending',
				slots: [{ id: 20 }],
			},
		];
		(db.booking.findMany as any).mockResolvedValue(staleBookings);
		(db.booking.update as any).mockResolvedValue({});
		(db.slot.updateMany as any).mockResolvedValue({});

		const req = createMockRequest({
			headers: { authorization: `Bearer ${CRON_SECRET}` },
		});

		const response = await GET(req);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(200);
		expect(body.cleaned).toBe(2);
		expect(db.booking.update).toHaveBeenCalledTimes(2);
		expect(db.slot.updateMany).toHaveBeenCalledTimes(2);
	});

	it('should return 0 when no stale bookings', async () => {
		(db.booking.findMany as any).mockResolvedValue([]);

		const req = createMockRequest({
			headers: { authorization: `Bearer ${CRON_SECRET}` },
		});

		const response = await GET(req);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(200);
		expect(body.cleaned).toBe(0);
	});

	it('should return 401 with wrong secret', async () => {
		const req = createMockRequest({
			headers: { authorization: 'Bearer wrong-secret' },
		});

		const response = await GET(req);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(401);
		expect(body.error).toBe('Unauthorized');
	});

	it('should return 401 with no auth header', async () => {
		const req = createMockRequest({});

		const response = await GET(req);
		const { status } = await parseResponse(response);

		expect(status).toBe(401);
	});

	it('should return 500 on database error', async () => {
		(db.booking.findMany as any).mockRejectedValue(new Error('DB error'));

		const req = createMockRequest({
			headers: { authorization: `Bearer ${CRON_SECRET}` },
		});

		const response = await GET(req);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(500);
		expect(body.error).toBe('DB error');
	});
});
