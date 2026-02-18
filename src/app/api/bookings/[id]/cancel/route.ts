export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@db';
import { getSessionUser } from '@/server/auth/auth';
import { getStripe } from '@lib/stripe';
import { Slot } from '@prisma/client';

export const POST = async (
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) => {
	try {
		const user = await getSessionUser();

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { id } = await params;
		const bookingId = Number(id);
		const booking = await db.booking.findUnique({
			where: { id: bookingId },
			include: { slots: { orderBy: { startTime: 'asc' } } },
		});

		if (!booking) {
			return NextResponse.json(
				{ message: 'Booking not found' },
				{ status: 404 },
			);
		}

		// Verify ownership
		if (booking.userId !== user.id && user.role !== 'admin') {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
		}

		// Verify cancellation policy (24 hours notice)
		const firstSlot = booking.slots[0];
		let refundWarning: string | undefined;
		let refundStatus:
			| 'refunded'
			| 'not_refunded_policy'
			| 'not_applicable'
			| 'failed' = 'not_applicable';

		if (firstSlot && booking.paymentId) {
			const slotTime = new Date(firstSlot.startTime).getTime();
			const now = Date.now();
			const hoursUntilBooking = (slotTime - now) / (1000 * 60 * 60);

			if (hoursUntilBooking >= 24) {
				try {
					const stripe = getStripe();
					await stripe.refunds.create({
						payment_intent: booking.paymentId,
					});
					refundStatus = 'refunded';
				} catch (error) {
					console.error('Stripe refund failed:', error);
					refundWarning =
						'Booking cancelled, but automatic refund failed. Please contact support.';
					refundStatus = 'failed';
				}
			} else {
				refundStatus = 'not_refunded_policy';
			}
		}

		const slotIds = booking.slots.map((slot: Slot) => slot.id);

		if (slotIds.length > 0) {
			await db.slot.updateMany({
				where: { id: { in: slotIds } },
				data: { status: 'available' },
			});
		}

		await db.booking.update({
			where: { id: booking.id },
			data: { status: 'cancelled' },
		});

		return NextResponse.json({
			message: 'Booking cancelled successfully',
			refundWarning,
			refundStatus,
		});
	} catch (error) {
		console.error('Cancel booking error:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		);
	}
};
