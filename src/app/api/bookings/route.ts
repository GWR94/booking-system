export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { BookingService } from '@/server/modules/bookings/booking.service';
import { auth } from '../../../auth';
import { parseWithFirstError } from '@lib/zod';
import { apiBookingCreateSchema } from '@validation/api-schemas';
import { errorResponse } from '../_utils/responses';
import { makeBookingLifecycle } from '@/server/modules/booking-lifecycle/booking/booking-lifecycle';
import { normalizeCheckoutRequest } from '../_utils/checkout';

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
		const normalized = normalizeCheckoutRequest({
			items: [{ slotIds }],
			guestInfo,
			sessionUserId: userId ?? null,
		});
		if (!normalized.request) {
			return errorResponse(
				normalized.errors[0]?.message ?? 'Invalid checkout payload',
				400,
				'VALIDATION_ERROR',
			);
		}
		const checkoutRequest = normalized.request;

		const lifecycle = makeBookingLifecycle({ bookingService: BookingService });
		const result = await lifecycle.createPendingBooking({
			userId,
			slotIds: checkoutRequest.items.flatMap((item) => item.slotIds),
			paymentId,
			paymentStatus,
			guestInfo: checkoutRequest.guestInfo,
		});

		if (!result.ok) {
			return errorResponse(result.error, 500);
		}

		return NextResponse.json({
			message: checkoutRequest.guestInfo
				? 'Guest booking created successfully'
				: 'Booking created successfully',
			booking: result.booking,
			...(checkoutRequest.guestInfo && {
				guestEmail: checkoutRequest.guestInfo.email,
			}),
		});
	} catch (error) {
		console.error('Error creating booking:', error);
		return errorResponse(
			error instanceof Error ? error.message : 'Internal Server Error',
			500,
		);
	}
};
