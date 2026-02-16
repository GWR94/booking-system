import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockIsAdmin } = vi.hoisted(() => ({
	mockIsAdmin: vi.fn(),
}));

const { mockDb } = vi.hoisted(() => ({
	mockDb: {
		slot: {
			update: vi.fn(),
			delete: vi.fn(),
		},
	},
}));

vi.mock('@db', () => ({
	db: mockDb,
}));

vi.mock('@auth', () => ({
	isAdmin: mockIsAdmin,
}));

import { PUT, DELETE } from './route';
import { createMockRequest } from '@test/api-test-utils';

describe('Admin Slots [id] API', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('PUT /api/admin/slots/[id]', () => {
		it('should update slot if admin', async () => {
			mockIsAdmin.mockResolvedValue(true);
			mockDb.slot.update.mockResolvedValue({ id: 1 });

			const req = createMockRequest({
				method: 'PUT',
				body: {
					startTime: '2025-01-01T10:00:00Z',
					endTime: '2025-01-01T11:00:00Z',
					status: 'available',
					bay: 1,
				},
			});

			const response = await PUT(req, { params: Promise.resolve({ id: '1' }) });

			expect(response.status).toBe(200);
			const data = await response.json();
			expect(data.message).toBe('Slot updated successfully');
		});
	});

	describe('DELETE /api/admin/slots/[id]', () => {
		it('should delete slot if admin', async () => {
			mockIsAdmin.mockResolvedValue(true);
			mockDb.slot.delete.mockResolvedValue({ id: 1 });

			const req = createMockRequest({ method: 'DELETE' });
			const response = await DELETE(req, {
				params: Promise.resolve({ id: '1' }),
			});

			expect(response.status).toBe(200);
			const data = await response.json();
			expect(data.message).toBe('Slot deleted successfully');
		});
	});
});
