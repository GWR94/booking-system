import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockIsAdmin } = vi.hoisted(() => ({
	mockIsAdmin: vi.fn(),
}));

const { mockDb } = vi.hoisted(() => ({
	mockDb: {
		booking: {
			update: vi.fn(),
			findUnique: vi.fn(),
			delete: vi.fn(),
		},
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

import { PATCH, DELETE } from './route';
import { createMockRequest } from '@test/api-test-utils';

describe('Admin Bookings [id] API', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('PATCH /api/admin/bookings/[id]', () => {
		it('should update booking status if admin', async () => {
			mockIsAdmin.mockResolvedValue(true);
			mockDb.booking.update.mockResolvedValue({
				id: 1,
				status: 'cancelled',
			});

			const req = createMockRequest({
				method: 'PATCH',
				body: { status: 'cancelled' },
			});

			const response = await PATCH(req, {
				params: Promise.resolve({ id: '1' }),
			});

			expect(response.status).toBe(200);
			const data = await response.json();
			expect(data.message).toBe('Booking status updated successfully');
		});
	});

	describe('DELETE /api/admin/bookings/[id]', () => {
		it('should delete booking and free slots if admin', async () => {
			mockIsAdmin.mockResolvedValue(true);
			mockDb.booking.findUnique.mockResolvedValue({
				id: 1,
				slots: [{ id: 10 }, { id: 11 }],
			});
			mockDb.slot.updateMany.mockResolvedValue({ count: 2 });
			mockDb.booking.delete.mockResolvedValue({ id: 1 });

			const req = createMockRequest({ method: 'DELETE' });
			const response = await DELETE(req, {
				params: Promise.resolve({ id: '1' }),
			});

			expect(response.status).toBe(200);
			expect(mockDb.slot.updateMany).toHaveBeenCalled();
			expect(mockDb.booking.delete).toHaveBeenCalled();
		});

		it('should return 404 if booking not found', async () => {
			mockIsAdmin.mockResolvedValue(true);
			mockDb.booking.findUnique.mockResolvedValue(null);

			const req = createMockRequest({ method: 'DELETE' });
			const response = await DELETE(req, {
				params: Promise.resolve({ id: '999' }),
			});

			expect(response.status).toBe(404);
		});
	});
});
