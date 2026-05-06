export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@db';
import { requireSession } from '../../../_utils/auth';
import { getStripe } from '@lib/stripe';
import { sendRefundFailedAlert } from '@utils/email';
import { makeBookingLifecycle } from '@/server/modules/booking-lifecycle/booking/booking-lifecycle';

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
		const lifecycle = makeBookingLifecycle({
			db,
			stripe: getStripe(),
			sendRefundFailedAlert,
		});

		const result = await lifecycle.cancelBooking({
			bookingId,
			actor: { userId: user.id, role: user.role },
		});

		if (!result.ok) {
			return NextResponse.json(
				{ error: result.error, message: result.error },
				{ status: result.status },
			);
		}

		return NextResponse.json({
			message: 'Booking cancelled successfully',
			refundWarning: result.result.refundWarning,
			refundStatus: result.result.refundStatus,
		});
	} catch (error) {
		console.error('Cancel booking error:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		);
	}
};
