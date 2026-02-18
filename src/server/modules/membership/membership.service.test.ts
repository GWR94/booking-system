import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockUserUpdate = vi.fn();
const mockBookingFindMany = vi.fn();

vi.mock('@db', () => ({
	db: {
		user: {
			update: (...args: unknown[]) => mockUserUpdate(...args),
		},
		booking: {
			findMany: (...args: unknown[]) => mockBookingFindMany(...args),
		},
	},
}));

vi.mock('@config/membership.config', () => ({
	MEMBERSHIP_TIERS: {
		PAR: {
			priceId: 'price_par_123',
			includedHours: 5,
			weekendAccess: false,
		},
		BIRDIE: {
			priceId: 'price_birdie_456',
			includedHours: 10,
			weekendAccess: true,
		},
		HOLEINONE: {
			priceId: 'price_hole_789',
			includedHours: 15,
			weekendAccess: true,
		},
	},
}));

import { MembershipService } from './membership.service';

describe('MembershipService', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUserUpdate.mockResolvedValue({});
	});

	describe('handleMembershipUpdate', () => {
		it('should update user by stripeCustomerId for active subscription with matching tier', async () => {
			const subscription = {
				customer: 'cus_abc',
				status: 'active',
				current_period_start: Math.floor(Date.now() / 1000) - 86400 * 15,
				current_period_end: Math.floor(Date.now() / 1000) + 86400 * 15,
				cancel_at_period_end: false,
				items: {
					data: [{ price: { id: 'price_par_123' } }],
				},
			} as any;

			await MembershipService.handleMembershipUpdate(subscription);

			expect(mockUserUpdate).toHaveBeenCalledWith({
				where: { stripeCustomerId: 'cus_abc' },
				data: expect.objectContaining({
					membershipTier: 'PAR',
					membershipStatus: 'ACTIVE',
					cancelAtPeriodEnd: false,
				}),
			});
			expect(mockUserUpdate.mock.calls[0][0].data.currentPeriodStart).toBeInstanceOf(Date);
			expect(mockUserUpdate.mock.calls[0][0].data.currentPeriodEnd).toBeInstanceOf(Date);
		});

		it('should set tier to null and clear period when subscription status is not active', async () => {
			const subscription = {
				customer: 'cus_xyz',
				status: 'canceled',
				current_period_start: null,
				current_period_end: null,
				cancel_at_period_end: false,
				items: { data: [{ price: { id: 'price_par_123' } }] },
			} as any;

			await MembershipService.handleMembershipUpdate(subscription);

			expect(mockUserUpdate).toHaveBeenCalledWith({
				where: { stripeCustomerId: 'cus_xyz' },
				data: expect.objectContaining({
					currentPeriodStart: null,
					currentPeriodEnd: null,
					membershipTier: null,
					membershipStatus: 'CANCELLED',
				}),
			});
		});

		it('should set membershipStatus to CANCELLED when active but price not in tiers', async () => {
			const subscription = {
				customer: 'cus_unknown',
				status: 'active',
				current_period_start: Math.floor(Date.now() / 1000),
				current_period_end: Math.floor(Date.now() / 1000) + 86400 * 30,
				cancel_at_period_end: false,
				items: { data: [{ price: { id: 'price_unknown' } }] },
			} as any;

			await MembershipService.handleMembershipUpdate(subscription);

			expect(mockUserUpdate).toHaveBeenCalledWith({
				where: { stripeCustomerId: 'cus_unknown' },
				data: expect.objectContaining({
					membershipTier: null,
					membershipStatus: 'CANCELLED',
				}),
			});
		});

		it('should rethrow when db.user.update throws', async () => {
			mockUserUpdate.mockRejectedValueOnce(new Error('DB error'));
			const subscription = {
				customer: 'cus_abc',
				status: 'active',
				current_period_start: Math.floor(Date.now() / 1000),
				current_period_end: Math.floor(Date.now() / 1000) + 86400,
				cancel_at_period_end: false,
				items: { data: [{ price: { id: 'price_par_123' } }] },
			} as any;

			await expect(
				MembershipService.handleMembershipUpdate(subscription),
			).rejects.toThrow('DB error');
		});
	});

	describe('getUsageStats', () => {
		it('should return null when user has no active membership', async () => {
			const result = await MembershipService.getUsageStats({
				id: 1,
				membershipTier: null,
				membershipStatus: null,
				currentPeriodStart: null,
				currentPeriodEnd: null,
			});

			expect(result).toBeNull();
			expect(mockBookingFindMany).not.toHaveBeenCalled();
		});

		it('should return null when membership status is not ACTIVE', async () => {
			const result = await MembershipService.getUsageStats({
				id: 1,
				membershipTier: 'PAR',
				membershipStatus: 'CANCELLED',
				currentPeriodStart: new Date(),
				currentPeriodEnd: new Date(),
			});

			expect(result).toBeNull();
		});

		it('should return usedHours, totalHours and remainingHours for active member', async () => {
			// PAR tier: 5 included hours, no weekend. Two weekday slots = 2 hours used.
			mockBookingFindMany.mockResolvedValue([
				{
					slots: [
						{ startTime: new Date('2025-01-14T10:00:00Z') }, // Tuesday
						{ startTime: new Date('2025-01-15T10:00:00Z') }, // Wednesday
					],
				},
			]);

			const result = await MembershipService.getUsageStats({
				id: 1,
				membershipTier: 'PAR',
				membershipStatus: 'ACTIVE',
				currentPeriodStart: new Date('2025-01-01'),
				currentPeriodEnd: new Date('2025-01-31'),
			});

			expect(result).toEqual({
				usedHours: 2,
				totalHours: 5,
				remainingHours: 3,
			});
			expect(mockBookingFindMany).toHaveBeenCalledWith({
				where: {
					userId: 1,
					status: { in: ['confirmed', 'pending'] },
					bookingTime: {
						gte: new Date('2025-01-01'),
						lte: new Date('2025-01-31'),
					},
				},
				include: { slots: true },
			});
		});

		it('should not count weekend slots when tier has no weekend access', async () => {
			mockBookingFindMany.mockResolvedValue([
				{
					slots: [
						{ startTime: new Date('2025-01-11T10:00:00Z') }, // Saturday
						{ startTime: new Date('2025-01-14T10:00:00Z') }, // Tuesday
					],
				},
			]);

			const result = await MembershipService.getUsageStats({
				id: 1,
				membershipTier: 'PAR',
				membershipStatus: 'ACTIVE',
				currentPeriodStart: new Date('2025-01-01'),
				currentPeriodEnd: new Date('2025-01-31'),
			});

			// Only Tuesday counts (PAR has weekendAccess: false)
			expect(result?.usedHours).toBe(1);
			expect(result?.totalHours).toBe(5);
			expect(result?.remainingHours).toBe(4);
		});

		it('should return null when tier config is missing for user tier', async () => {
			mockBookingFindMany.mockResolvedValue([]);

			const result = await MembershipService.getUsageStats({
				id: 1,
				membershipTier: 'UNKNOWN_TIER' as any,
				membershipStatus: 'ACTIVE',
				currentPeriodStart: new Date('2025-01-01'),
				currentPeriodEnd: new Date('2025-01-31'),
			});

			expect(result).toBeNull();
		});

		it('should return null when findMany throws', async () => {
			mockBookingFindMany.mockRejectedValue(new Error('DB error'));

			const result = await MembershipService.getUsageStats({
				id: 1,
				membershipTier: 'PAR',
				membershipStatus: 'ACTIVE',
				currentPeriodStart: new Date('2025-01-01'),
				currentPeriodEnd: new Date('2025-01-31'),
			});

			expect(result).toBeNull();
		});
	});
});
