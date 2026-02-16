import { db } from '@db';
import { getStripe } from '@lib/stripe';
import { handleSendEmail } from '@utils/email';
import { groupSlotsByBay } from '@utils';
import { getServerAppUrl, getLogoUrl } from '@lib/app-url';
// Logger? Maybe just console for now or simple wrapper.

// stripe is now handled by getStripe utility inside methods

export class BookingService {
	/**
	 * Create a booking for a user (authenticated or guest)
	 */
	static async createBooking({
		userId,
		slotIds,
		paymentId,
		paymentStatus,
		guestInfo,
	}: {
		userId?: number;
		slotIds: number[];
		paymentId?: string;
		paymentStatus?: string;
		guestInfo?: { name: string; email: string; phone?: string };
	}) {
		const booking = await db.$transaction(async (tx) => {
			let finalUserId = userId;

			if (guestInfo) {
				const guestUser = await tx.user.upsert({
					where: { email: guestInfo.email },
					update: {
						name: guestInfo.name,
						...(guestInfo.phone && { phone: guestInfo.phone }),
					},
					create: {
						email: guestInfo.email,
						name: guestInfo.name,
						...(guestInfo.phone && { phone: guestInfo.phone }),
						role: 'guest',
					},
				});
				finalUserId = guestUser.id;
			}

			if (!finalUserId) {
				throw new Error('User ID or guest info must be provided');
			}

			const slots = await tx.slot.findMany({
				where: {
					id: { in: slotIds },
					status: 'available',
				},
			});

			if (slots.length !== slotIds.length) {
				throw new Error('One or more slots do not exist or have been booked');
			}

			const newBooking = await tx.booking.create({
				data: {
					user: { connect: { id: finalUserId } },
					slots: { connect: slotIds.map((id) => ({ id })) },
					status: 'pending',
					paymentId,
					paymentStatus,
				},
				include: { slots: true },
			});

			await tx.slot.updateMany({
				where: { id: { in: slotIds } },
				data: { status: 'awaiting payment' },
			});

			return newBooking;
		});

		return booking;
	}

	/**
	 * Confirm a booking after successful payment
	 */
	static async confirmBooking(
		bookingId: number,
		paymentId: string,
		paymentStatus: string,
	) {
		const update = await db.$transaction(async (tx) => {
			return tx.booking.update({
				where: { id: bookingId },
				data: {
					status: 'confirmed',
					paymentId,
					paymentStatus,
				},
			});
		});

		const booking = await db.booking.findUnique({
			where: { id: update.id },
			include: {
				slots: { include: { bay: true } },
				user: true,
			},
		});

		if (!booking) {
			throw new Error('Booking not found');
		}

		const stripe = getStripe();
		const intent = await stripe.paymentIntents.retrieve(paymentId);
		const amount = intent.amount / 100;
		const groupedSlots = groupSlotsByBay(booking.slots as any);

		if (booking.user.email) {
			await handleSendEmail({
				senderPrefix: 'bookings',
				recipientEmail: booking.user.email,
				templateName: 'confirmation',
				subject: 'Booking Confirmation',
				templateContext: {
					booking: {
						id: booking.id,
						slots: groupedSlots,
					},
					payment: {
						intentId: paymentId,
						amount: amount.toFixed(2),
					},
					year: new Date().getFullYear(),
					baseUrl: getServerAppUrl(),
					logoUrl: getLogoUrl(),
				},
			});
		}

		return booking;
	}

	/**
	 * Handle failed payment by releasing slots
	 */
	static async handleFailedPayment(bookingId: number) {
		return db.$transaction(async (tx) => {
			const booking = await tx.booking.update({
				where: { id: bookingId },
				data: { status: 'failed' },
				include: { slots: true },
			});

			const slotIds = booking.slots.map((slot: any) => slot.id);

			await tx.slot.updateMany({
				where: { id: { in: slotIds } },
				data: { status: 'available' },
			});

			return booking;
		});
	}
}
