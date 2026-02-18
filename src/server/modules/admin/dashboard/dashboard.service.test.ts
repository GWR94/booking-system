import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockUserCount = vi.fn();
const mockBookingCount = vi.fn();

vi.mock('@db', () => ({
	db: {
		user: {
			count: (...args: unknown[]) => mockUserCount(...args),
		},
		booking: {
			count: (...args: unknown[]) => mockBookingCount(...args),
		},
	},
}));

import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// getDashboardStats runs Promise.all with 9 counts in order:
		// totalUsers, activeMembers, totalBookings, bookingsToday, cancelledBookings,
		// parMembers, birdieMembers, holeInOneMembers, activeNoTier
		mockUserCount
			.mockResolvedValueOnce(100)   // totalUsers
			.mockResolvedValueOnce(25)    // activeMembers
			.mockResolvedValueOnce(10)    // parMembers
			.mockResolvedValueOnce(8)     // birdieMembers
			.mockResolvedValueOnce(7)     // holeInOneMembers
			.mockResolvedValueOnce(0);    // activeNoTier
		mockBookingCount
			.mockResolvedValueOnce(500)   // totalBookings
			.mockResolvedValueOnce(12)    // bookingsToday
			.mockResolvedValueOnce(5);    // cancelledBookings
	});

	it('should return dashboard stats with user counts, booking counts and membership stats', async () => {
		const result = await DashboardService.getDashboardStats();

		expect(result).toEqual({
			totalUsers: 100,
			activeMembers: 25,
			totalBookings: 500,
			bookingsToday: 12,
			cancelledBookings: 5,
			membershipStats: {
				PAR: 10,
				BIRDIE: 8,
				HOLEINONE: 7,
				NONE: 0,
			},
		});
		expect(mockUserCount).toHaveBeenCalledTimes(6);
		expect(mockBookingCount).toHaveBeenCalledTimes(3);
	});
});
