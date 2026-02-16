import { db } from '@db';
import dayjs from 'dayjs';

export class DashboardService {
	/**
	 * Get dashboard statistics including user counts, bookings, and membership tiers
	 */
	static async getDashboardStats() {
		const today = dayjs().startOf('day');
		const tomorrow = today.add(1, 'day');

		const [
			totalUsers,
			activeMembers,
			totalBookings,
			bookingsToday,
			cancelledBookings,
			parMembers,
			birdieMembers,
			holeInOneMembers,
			activeNoTier,
		] = await Promise.all([
			db.user.count(),
			db.user.count({
				where: { membershipStatus: 'ACTIVE' },
			}),
			db.booking.count(),
			db.booking.count({
				where: {
					bookingTime: {
						gte: today.toDate(),
						lt: tomorrow.toDate(),
					},
				},
			}),
			db.booking.count({
				where: { status: 'cancelled' },
			}),
			db.user.count({
				where: { membershipTier: 'PAR', membershipStatus: 'ACTIVE' },
			}),
			db.user.count({
				where: { membershipTier: 'BIRDIE', membershipStatus: 'ACTIVE' },
			}),
			db.user.count({
				where: { membershipTier: 'HOLEINONE', membershipStatus: 'ACTIVE' },
			}),
			db.user.count({
				where: { membershipTier: null, membershipStatus: 'ACTIVE' },
			}),
		]);

		return {
			totalUsers,
			activeMembers,
			totalBookings,
			bookingsToday,
			cancelledBookings,
			membershipStats: {
				PAR: parMembers,
				BIRDIE: birdieMembers,
				HOLEINONE: holeInOneMembers,
				NONE: activeNoTier,
			},
		};
	}
}
