import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockRequest, parseResponse } from '@test/api-test-utils';

const mockIsAdmin = vi.fn();
const mockGetAllBookings = vi.fn();

vi.mock('src/server/auth/auth', () => ({
	isAdmin: (...args: unknown[]) => mockIsAdmin(...args),
}));

vi.mock('@modules', () => ({
	AdminBookingsService: {
		getAllBookings: (...args: unknown[]) => mockGetAllBookings(...args),
	},
}));

import { GET } from './route';

describe('GET /api/admin/bookings', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should return 403 for non-admin', async () => {
		mockIsAdmin.mockResolvedValue(false);
		const req = createMockRequest({ method: 'GET' });
		const response = await GET(req);
		const { body, status } = await parseResponse(response);
		expect(status).toBe(403);
		expect(body.error).toBe('Unauthorized');
		expect(mockGetAllBookings).not.toHaveBeenCalled();
	});

	it('should return bookings with default page and limit', async () => {
		mockIsAdmin.mockResolvedValue(true);
		const mockResult = { bookings: [], total: 0, page: 1, limit: 10 };
		mockGetAllBookings.mockResolvedValue(mockResult);

		const req = createMockRequest({ method: 'GET' });
		const response = await GET(req);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(200);
		expect(body).toEqual(mockResult);
		expect(mockGetAllBookings).toHaveBeenCalledWith({
			page: 1,
			limit: 10,
			search: '',
		});
	});

	it('should pass page, limit, and search to service', async () => {
		mockIsAdmin.mockResolvedValue(true);
		mockGetAllBookings.mockResolvedValue({ bookings: [], total: 0, page: 2, limit: 20 });

		const req = createMockRequest({
			method: 'GET',
			query: { page: '2', limit: '20', search: 'john' },
		});
		const response = await GET(req);
		const { status } = await parseResponse(response);

		expect(status).toBe(200);
		expect(mockGetAllBookings).toHaveBeenCalledWith({
			page: 2,
			limit: 20,
			search: 'john',
		});
	});

	it('should return 500 on service error', async () => {
		mockIsAdmin.mockResolvedValue(true);
		mockGetAllBookings.mockRejectedValue(new Error('DB error'));

		const req = createMockRequest({ method: 'GET' });
		const response = await GET(req);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(500);
		expect(body.error).toBe('DB error');
	});
});
