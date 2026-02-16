import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockIsAdmin } = vi.hoisted(() => ({
	mockIsAdmin: vi.fn(),
}));

const { mockDb } = vi.hoisted(() => ({
	mockDb: {
		slot: {
			findMany: vi.fn(),
			create: vi.fn(),
		},
	},
}));

vi.mock('@db', () => ({
	db: mockDb,
}));

vi.mock('@auth', () => ({
	isAdmin: mockIsAdmin,
}));

import { GET, POST } from './route';
import { createMockRequest } from '@test/api-test-utils';

describe('Admin Slots API', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('GET /api/admin/slots', () => {
		it('should return slots for a day if admin', async () => {
			mockIsAdmin.mockResolvedValue(true);
			mockDb.slot.findMany.mockResolvedValue([
				{ id: 1, startTime: new Date() },
			]);

			const req = createMockRequest({
				method: 'GET',
				url: 'http://localhost/api/admin/slots?date=2025-01-01',
			});

			const response = await GET(req);

			expect(response.status).toBe(200);
			const data = await response.json();
			expect(data).toHaveLength(1);
			expect(mockDb.slot.findMany).toHaveBeenCalled();
		});

		it('should return 403 if not admin', async () => {
			mockIsAdmin.mockResolvedValue(false);

			const req = createMockRequest({
				method: 'GET',
				url: 'http://localhost/api/admin/slots?date=2025-01-01',
			});

			const response = await GET(req);
			expect(response.status).toBe(403);
		});
	});

	describe('POST /api/admin/slots', () => {
		it('should create slot if admin', async () => {
			mockIsAdmin.mockResolvedValue(true);
			mockDb.slot.create.mockResolvedValue({ id: 2 });

			const req = createMockRequest({
				method: 'POST',
				body: {
					startTime: '2025-01-01T10:00:00Z',
					endTime: '2025-01-01T11:00:00Z',
					bay: 1,
				},
			});

			const response = await POST(req);

			expect(response.status).toBe(201);
			const data = await response.json();
			expect(data.message).toBe('Slot created successfully');
			expect(mockDb.slot.create).toHaveBeenCalled();
		});
	});
});
