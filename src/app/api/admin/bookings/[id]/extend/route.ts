export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/server/auth/auth';
import { AdminBookingsService } from '@modules';
import { parseWithFirstError } from '@lib/zod';
import { apiAdminBookingExtendSchema } from '@validation/api-schemas';
import { errorResponse } from '../../../../_utils/responses';
import { makeAdminBookingLifecycle } from '@/server/modules/booking-lifecycle/admin-booking/admin-booking-lifecycle';

export const PATCH = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) => {
	if (!(await isAdmin())) {
		return errorResponse('Unauthorized', 403, 'FORBIDDEN');
	}

	try {
		const { id } = await params;
		const rawBody = await req.json();
		const parsed = parseWithFirstError(apiAdminBookingExtendSchema, rawBody);
		if (!parsed.success) {
			return errorResponse(parsed.message, 400, 'VALIDATION_ERROR');
		}
		const { hours } = parsed.data;

		const lifecycle = makeAdminBookingLifecycle({
			adminBookingsService: AdminBookingsService,
		});

		const result = await lifecycle.extendBooking({
			user: { role: 'admin' },
			bookingId: Number(id),
			hours,
		});

		if (!result.ok) {
			if (result.status === 404) {
				return errorResponse(result.message, 404, result.code);
			}
			return errorResponse(result.message, result.status);
		}

		return NextResponse.json(result.value);
	} catch (error) {
		console.error('Extend booking error:', error);

		if (error instanceof Error && error.message === 'Booking not found') {
			return errorResponse('Booking not found', 404, 'NOT_FOUND');
		}

		return errorResponse(
			error instanceof Error ? error.message : 'Internal Server Error',
			500,
		);
	}
};
