import { db } from '@db';
import { getStripe } from '@lib/stripe';
import { handleSendEmail } from '@utils/email';
import { groupSlotsByBay } from '@utils';
import dayjs from 'dayjs';

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
		if (!Array.isArray(slotIds) || slotIds.length === 0) {
			throw new Error('At least one slot is required to create a booking');
		}

		if (!userId && !guestInfo) {
			throw new Error('User ID or guest info must be provided');
		}

		if (guestInfo && (!guestInfo.name?.trim() || !guestInfo.email?.trim())) {
			throw new Error('Guest name and email are required');
		}

		const booking = await db.$transaction(async (tx) => {
			const slots = await (tx as typeof db).slot.findMany({
				where: {
					id: { in: slotIds },
					status: 'available',
				},
			});

			if (slots.length !== slotIds.length) {
				throw new Error('One or more slots do not exist or have been booked');
			}

			const newBooking = await (tx as typeof db).booking.create({
				data: {
					...(userId && { user: { connect: { id: userId } } }),
					...(guestInfo && {
						guestName: guestInfo.name,
						guestEmail: guestInfo.email,
						guestPhone: guestInfo.phone,
					}),
					slots: { connect: slotIds.map((id) => ({ id })) },
					status: 'pending',
					paymentId,
					paymentStatus,
				},
				include: { slots: true },
			});

			await (tx as typeof db).slot.updateMany({
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
			return (tx as typeof db).booking.update({
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
		const recipientEmail = booking.user?.email ?? booking.guestEmail;

		if (recipientEmail) {
			await handleSendEmail({
				senderPrefix: 'bookings',
				recipientEmail,
				templateName: 'confirmation',
				subject: 'Booking Confirmation',
				templateContext: {
					booking: {
						id: booking.id,
						slots: groupedSlots.map((slot) => ({
							bay: `Bay ${slot.bayId}`,
							date: dayjs(slot.startTime).format('DD MMM YYYY'),
							startTime: dayjs(slot.startTime).format('HH:mm'),
							endTime: dayjs(slot.endTime).format('HH:mm'),
						})),
					},
					payment: {
						intentId: paymentId,
						amount: amount.toFixed(2),
					},
					year: new Date().getFullYear(),
					baseUrl: process.env.NEXT_PUBLIC_APP_URL,
					logoUrl: process.env.LOGO_URL,
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
			const booking = await (tx as typeof db).booking.update({
				where: { id: bookingId },
				data: { status: 'failed' },
				include: { slots: true },
			});

			const slotIds = booking.slots.map((slot: any) => slot.id);

			await (tx as typeof db).slot.updateMany({
				where: { id: { in: slotIds } },
				data: { status: 'available' },
			});

			return booking;
		});
	}
}
