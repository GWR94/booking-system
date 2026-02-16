import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockDb } = vi.hoisted(() => ({
	mockDb: {
		slot: { findMany: vi.fn() },
	},
}));

vi.mock('@db', () => ({
	db: mockDb,
}));

import { GET } from './route';
import { createMockRequest } from '@test/api-test-utils';

describe('GET /api/slots', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should return available slots within date range', async () => {
		const mockSlots = [{ id: 1, startTime: '2025-01-01T10:00:00Z' }];
		mockDb.slot.findMany.mockResolvedValue(mockSlots);

		const req = createMockRequest({
			method: 'GET',
			url: 'http://localhost/api/slots?from=2025-01-01&to=2025-01-02',
		});

		const response = await GET(req);

		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data).toEqual(mockSlots);
		expect(mockDb.slot.findMany).toHaveBeenCalledWith({
			where: {
				startTime: {
					lte: '2025-01-02',
					gte: '2025-01-01',
				},
				status: 'available',
			},
			orderBy: { startTime: 'asc' },
		});
	});

	it('should return 400 if "from" date missing', async () => {
		const req = createMockRequest({
			method: 'GET',
			url: 'http://localhost/api/slots?to=2025-01-02',
		});

		const response = await GET(req);

		expect(response.status).toBe(400);
	});
});
