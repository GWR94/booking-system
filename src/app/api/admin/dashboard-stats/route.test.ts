import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseResponse } from '@test/api-test-utils';

const mockIsAdmin = vi.fn();
const mockGetDashboardStats = vi.fn();

vi.mock('src/server/auth/auth', () => ({
	isAdmin: (...args: any[]) => mockIsAdmin(...args),
}));

vi.mock('@modules', () => ({
	DashboardService: {
		getDashboardStats: (...args: any[]) => mockGetDashboardStats(...args),
	},
}));

import { GET } from './route';

describe('GET /api/admin/dashboard-stats', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should return dashboard stats for admin', async () => {
		mockIsAdmin.mockResolvedValue(true);
		const mockStats = {
			totalUsers: 100,
			activeMembers: 25,
			totalBookings: 500,
			bookingsToday: 10,
			cancelledBookings: 5,
			membershipStats: {
				PAR: 10,
				BIRDIE: 8,
				HOLEINONE: 7,
				NONE: 0,
			},
		};
		mockGetDashboardStats.mockResolvedValue(mockStats);

		const response = await GET();
		const { body, status } = await parseResponse(response);

		expect(status).toBe(200);
		expect(body).toEqual(mockStats);
	});

	it('should return 403 for non-admin', async () => {
		mockIsAdmin.mockResolvedValue(false);

		const response = await GET();
		const { body, status } = await parseResponse(response);

		expect(status).toBe(403);
		expect(body.error).toBe('Unauthorized');
	});

	it('should return 500 on service error', async () => {
		mockIsAdmin.mockResolvedValue(true);
		mockGetDashboardStats.mockRejectedValue(new Error('Service error'));

		const response = await GET();
		const { body, status } = await parseResponse(response);

		expect(status).toBe(500);
		expect(body.error).toBe('Service error');
	});
});
