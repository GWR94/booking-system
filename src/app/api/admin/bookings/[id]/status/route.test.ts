import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockRequest, createMockParams, parseResponse } from '@test/api-test-utils';

const mockIsAdmin = vi.fn();
const mockUpdateStatus = vi.fn();

vi.mock('src/server/auth/auth', () => ({
	isAdmin: (...args: any[]) => mockIsAdmin(...args),
}));

vi.mock('@modules', () => ({
	AdminBookingsService: {
		updateBookingStatus: (...args: any[]) => mockUpdateStatus(...args),
	},
}));

import { PATCH } from './route';

describe('PATCH /api/admin/bookings/[id]/status', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should update booking status for admin', async () => {
		mockIsAdmin.mockResolvedValue(true);
		mockUpdateStatus.mockResolvedValue({
			message: 'Booking status updated successfully',
			booking: { id: 42, status: 'confirmed' },
		});

		const req = createMockRequest({
			method: 'PATCH',
			body: { status: 'confirmed' },
		});
		const params = createMockParams({ id: '42' });
		const response = await PATCH(req, params);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(200);
		expect(body.message).toContain('updated');
		expect(mockUpdateStatus).toHaveBeenCalledWith(42, 'confirmed');
	});

	it('should return 403 for non-admin', async () => {
		mockIsAdmin.mockResolvedValue(false);

		const req = createMockRequest({
			method: 'PATCH',
			body: { status: 'confirmed' },
		});
		const params = createMockParams({ id: '42' });
		const response = await PATCH(req, params);
		const { status } = await parseResponse(response);

		expect(status).toBe(403);
	});
});
