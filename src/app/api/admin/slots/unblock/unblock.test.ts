import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockIsAdmin } = vi.hoisted(() => ({
	mockIsAdmin: vi.fn(),
}));

const { mockDb } = vi.hoisted(() => ({
	mockDb: {
		slot: {
			updateMany: vi.fn(),
		},
	},
}));

vi.mock('@db', () => ({
	db: mockDb,
}));

vi.mock('@auth', () => ({
	isAdmin: mockIsAdmin,
}));

import { POST } from './route';
import { createMockRequest } from '@test/api-test-utils';

describe('POST /api/admin/slots/unblock', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should unblock slots if admin', async () => {
		mockIsAdmin.mockResolvedValue(true);
		mockDb.slot.updateMany.mockResolvedValue({ count: 3 });

		const req = createMockRequest({
			method: 'POST',
			body: {
				startTime: '2025-01-01T10:00:00Z',
				endTime: '2025-01-01T18:00:00Z',
			},
		});

		const response = await POST(req);

		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data.count).toBe(3);
		expect(mockDb.slot.updateMany).toHaveBeenCalledWith(
			expect.objectContaining({
				data: { status: 'available' },
			}),
		);
	});
});
