export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@db';
import { getStripe } from '@lib/stripe';
import { requireSession } from '../../../_utils/auth';
import { errorResponse } from '../../../_utils/responses';

export const POST = async (
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) => {
	try {
		const auth = await requireSession();
		if (!auth.ok) return auth.response;
		const { user } = auth;

		const { id } = await params;
		const bookingId = Number(id);
		if (!Number.isInteger(bookingId) || bookingId < 1) {
			return errorResponse('Invalid booking id', 400, 'VALIDATION_ERROR');
		}

		const booking = await db.booking.findUnique({
			where: { id: bookingId },
			include: {
				slots: {
					orderBy: { endTime: 'desc' },
					select: { id: true, endTime: true },
				},
			},
		});

		if (!booking) {
			return errorResponse('Booking not found', 404, 'NOT_FOUND');
		}

		if (booking.userId !== user.id) {
			return errorResponse('Forbidden', 403, 'FORBIDDEN');
		}

		if (booking.status !== 'pending') {
			return errorResponse(
				'Only pending bookings can be resumed',
				400,
				'BOOKING_NOT_PENDING',
			);
		}

		if (!booking.paymentId) {
			return errorResponse(
				'Booking has no pending payment',
				400,
				'PAYMENT_INTENT_REQUIRED',
			);
		}

		const lastSlot = booking.slots[0];
		if (lastSlot && new Date(lastSlot.endTime).getTime() < Date.now()) {
			return errorResponse('Booking has expired', 400, 'BOOKING_EXPIRED');
		}

		const stripe = getStripe();
		const intent = await stripe.paymentIntents.retrieve(booking.paymentId);

		if (!intent.client_secret) {
			return errorResponse(
				'Unable to resume this payment',
				400,
				'PAYMENT_RESUME_UNAVAILABLE',
			);
		}

		if (intent.status === 'succeeded' || intent.status === 'canceled') {
			return errorResponse(
				'Payment intent is no longer resumable',
				400,
				'PAYMENT_NOT_RESUMABLE',
			);
		}

		return NextResponse.json({
			clientSecret: intent.client_secret,
			paymentIntentId: intent.id,
		});
	} catch (error) {
		console.error('Resume payment error:', error);
		return errorResponse('Internal Server Error', 500);
	}
};

