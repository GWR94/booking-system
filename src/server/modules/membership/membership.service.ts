import { db } from '@db';
import { MEMBERSHIP_TIERS, MembershipTier } from '@config/membership.config';
import Stripe from 'stripe';

export class MembershipService {
	/**
	 * Handle all subscription-related events from Stripe (created, updated, deleted)
	 */
	static async handleMembershipUpdate(subscription: Stripe.Subscription) {
		const customerId = subscription.customer as string;
		const stripeStatus = subscription.status;
		const currentPeriodStart = (subscription as any).current_period_start
			? new Date((subscription as any).current_period_start * 1000)
			: null;
		const currentPeriodEnd = (subscription as any).current_period_end
			? new Date((subscription as any).current_period_end * 1000)
			: null;
		const priceId = subscription.items?.data[0]?.price.id;

		const tierEntry = Object.entries(MEMBERSHIP_TIERS).find(
			([, val]) => val.priceId === priceId,
		);
		const tier = tierEntry ? (tierEntry[0] as MembershipTier) : null;

		let mappedStatus = 'CANCELLED'; // Using string enum or type
		if (stripeStatus === 'active') {
			mappedStatus = 'ACTIVE';
		}

		try {
			await db.user.update({
				where: { stripeCustomerId: customerId },
				data: {
					currentPeriodStart:
						mappedStatus === 'ACTIVE' ? currentPeriodStart : null,
					currentPeriodEnd:
						mappedStatus === 'ACTIVE' && tier ? currentPeriodEnd : null,
					cancelAtPeriodEnd: subscription.cancel_at_period_end,
					membershipTier: mappedStatus === 'ACTIVE' && tier ? tier : null,
					membershipStatus:
						mappedStatus === 'ACTIVE' && !tier
							? 'CANCELLED'
							: (mappedStatus as 'ACTIVE' | 'CANCELLED'),
				},
			});
			console.log(
				`Updated membership for customer ${customerId} to ${mappedStatus}`,
			);
		} catch (error) {
			console.error(
				`Error updating membership for customer ${customerId}: ${error}`,
			);
			throw error;
		}
	}

	static async getUsageStats(user: {
		id: number;
		membershipTier: MembershipTier | null;
		membershipStatus: string | null;
		currentPeriodStart: Date | null;
		currentPeriodEnd: Date | null;
	}) {
		if (
			!user.membershipTier ||
			user.membershipStatus !== 'ACTIVE' ||
			!user.currentPeriodStart ||
			!user.currentPeriodEnd
		) {
			return null;
		}

		try {
			const tierConfig = MEMBERSHIP_TIERS[user.membershipTier];
			if (!tierConfig) return null;

			const bookings = await db.booking.findMany({
				where: {
					userId: user.id,
					status: { in: ['confirmed', 'pending'] },
					bookingTime: {
						gte: user.currentPeriodStart,
						lte: user.currentPeriodEnd,
					},
				},
				include: { slots: true },
			});

			let usedHours = 0;
			bookings.forEach((booking: any) => {
				booking.slots.forEach((slot: any) => {
					const slotTime = new Date(slot.startTime);
					const dayOfWeek = slotTime.getDay(); // 0 = Sunday, 6 = Saturday
					const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
					const isEligible = tierConfig.weekendAccess || !isWeekend;

					if (isEligible) {
						usedHours++;
					}
				});
			});

			const totalHours = tierConfig.includedHours;
			const remainingHours = Math.max(0, totalHours - usedHours);

			return {
				usedHours,
				totalHours,
				remainingHours,
			};
		} catch (error) {
			console.error(
				`Error calculating usage stats for user ${user.id}: ${error}`,
			);
			return null;
		}
	}
}
