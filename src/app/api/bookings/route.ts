export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { BookingService } from 'src/server/modules/bookings/booking.service';
import { auth } from '../../../auth';
import { apiBookingCreateSchema } from '@validation/api-schemas';
import { errorResponse } from '../_utils/responses';

interface BookingRequest {
	slotIds: number[];
	paymentId?: string;
	paymentStatus?: string;
	guestInfo?: {
		name: string;
		email: string;
		phone?: string;
	};
}

export async function POST(req: NextRequest) {
	try {
		const rawBody: BookingRequest = await req.json();
		const { error, value } = apiBookingCreateSchema.validate(rawBody, {
			abortEarly: false,
			stripUnknown: true,
		});
		if (error) {
			return errorResponse(error.details[0].message, 400, 'VALIDATION_ERROR');
		}

		const body = value as BookingRequest;
		const { slotIds, paymentId, paymentStatus, guestInfo } = body;

		// Get authenticated user if available
		const session = await auth();
		const userId = session?.user?.id
			? parseInt(session.user.id, 10)
			: undefined;

		// Must have either an authenticated user or guest info
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
}
