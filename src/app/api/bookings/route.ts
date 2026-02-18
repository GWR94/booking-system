export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { BookingService } from '@/server/modules/bookings/booking.service';
import { auth } from '../../../auth';
import { parseWithFirstError } from '@lib/zod';
import { apiBookingCreateSchema } from '@validation/api-schemas';
import { errorResponse } from '../_utils/responses';

export const POST = async (req: NextRequest) => {
	try {
		const rawBody = await req.json();
		const parsed = parseWithFirstError(apiBookingCreateSchema, rawBody);
		if (!parsed.success) {
			return errorResponse(parsed.message, 400, 'VALIDATION_ERROR');
		}
		const { slotIds, paymentId, paymentStatus, guestInfo } = parsed.data;

		const session = await auth();
		const userId = session?.user?.id ? Number(session.user.id) : undefined;

		if (!userId && !guestInfo) {
			return errorResponse(
				'Authentication required or guest info must be provided',
				401,
				'AUTH_REQUIRED',
			);
		}

		const booking = await BookingService.createBooking({
			userId,
			slotIds,
			paymentId,
			paymentStatus,
			guestInfo,
		});

		return NextResponse.json({
			message: guestInfo
				? 'Guest booking created successfully'
				: 'Booking created successfully',
			booking,
			...(guestInfo && { guestEmail: guestInfo.email }),
		});
	} catch (error) {
		console.error('Error creating booking:', error);
		return errorResponse(
			error instanceof Error ? error.message : 'Internal Server Error',
			500,
		);
	}
};
