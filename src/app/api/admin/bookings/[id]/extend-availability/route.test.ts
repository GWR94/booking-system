import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockRequest, createMockParams, parseResponse } from '@test/api-test-utils';

const mockIsAdmin = vi.fn();
const mockCheckAvailability = vi.fn();

vi.mock('src/server/auth/auth', () => ({
	isAdmin: (...args: any[]) => mockIsAdmin(...args),
}));

vi.mock('@modules', () => ({
	AdminBookingsService: {
		checkBookingExtendAvailability: (...args: any[]) =>
			mockCheckAvailability(...args),
	},
}));

import { GET } from './route';

describe('GET /api/admin/bookings/[id]/extend-availability', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should return extend availability for admin', async () => {
		mockIsAdmin.mockResolvedValue(true);
		mockCheckAvailability.mockResolvedValue({
			canExtend1Hour: true,
			canExtend2Hours: false,
		});

		const req = createMockRequest({});
		const params = createMockParams({ id: '42' });
		const response = await GET(req, params);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(200);
		expect(body.canExtend1Hour).toBe(true);
		expect(body.canExtend2Hours).toBe(false);
		expect(mockCheckAvailability).toHaveBeenCalledWith(42);
	});

	it('should return 403 for non-admin', async () => {
		mockIsAdmin.mockResolvedValue(false);

		const req = createMockRequest({});
		const params = createMockParams({ id: '42' });
		const response = await GET(req, params);
		const { status } = await parseResponse(response);

		expect(status).toBe(403);
	});

	it('should return 404 when booking not found', async () => {
		mockIsAdmin.mockResolvedValue(true);
		mockCheckAvailability.mockRejectedValue(new Error('Booking not found'));

		const req = createMockRequest({});
		const params = createMockParams({ id: '999' });
		const response = await GET(req, params);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(404);
		expect(body.message).toBe('Booking not found');
	});
});
