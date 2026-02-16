import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockRequest, createMockParams, parseResponse } from '@test/api-test-utils';

const mockIsAdmin = vi.fn();
const mockExtendBooking = vi.fn();

vi.mock('src/server/auth/auth', () => ({
	isAdmin: (...args: any[]) => mockIsAdmin(...args),
}));

vi.mock('@modules', () => ({
	AdminBookingsService: {
		extendBooking: (...args: any[]) => mockExtendBooking(...args),
	},
}));

import { PATCH } from './route';

describe('PATCH /api/admin/bookings/[id]/extend', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should extend booking by 1 hour', async () => {
		mockIsAdmin.mockResolvedValue(true);
		mockExtendBooking.mockResolvedValue({
			message: 'Booking extended by 1 hour(s) successfully',
			booking: { id: 42 },
		});

		const req = createMockRequest({
			method: 'PATCH',
			body: { hours: 1 },
		});
		const params = createMockParams({ id: '42' });
		const response = await PATCH(req, params);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(200);
		expect(body.message).toContain('extended');
		expect(mockExtendBooking).toHaveBeenCalledWith(42, 1);
	});

	it('should extend booking by 2 hours', async () => {
		mockIsAdmin.mockResolvedValue(true);
		mockExtendBooking.mockResolvedValue({
			message: 'Booking extended by 2 hour(s) successfully',
			booking: { id: 42 },
		});

		const req = createMockRequest({
			method: 'PATCH',
			body: { hours: 2 },
		});
		const params = createMockParams({ id: '42' });
		const response = await PATCH(req, params);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(200);
		expect(mockExtendBooking).toHaveBeenCalledWith(42, 2);
	});

	it('should return 403 for non-admin', async () => {
		mockIsAdmin.mockResolvedValue(false);

		const req = createMockRequest({
			method: 'PATCH',
			body: { hours: 1 },
		});
		const params = createMockParams({ id: '42' });
		const response = await PATCH(req, params);
		const { status } = await parseResponse(response);

		expect(status).toBe(403);
	});

	it('should return 404 when booking not found', async () => {
		mockIsAdmin.mockResolvedValue(true);
		mockExtendBooking.mockRejectedValue(new Error('Booking not found'));

		const req = createMockRequest({
			method: 'PATCH',
			body: { hours: 1 },
		});
		const params = createMockParams({ id: '999' });
		const response = await PATCH(req, params);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(404);
		expect(body.message).toBe('Booking not found');
	});
});
