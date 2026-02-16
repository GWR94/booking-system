export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from 'src/server/auth/auth';
import { AdminBookingsService } from '@modules';
import { apiAdminBookingExtendSchema } from '@validation/api-schemas';
import { errorResponse } from '../../../../_utils/responses';

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	if (!(await isAdmin())) {
		return errorResponse('Unauthorized', 403, 'FORBIDDEN');
	}

	try {
		const { id } = await params;
		const rawBody = await req.json();
		const { error, value } = apiAdminBookingExtendSchema.validate(rawBody, {
			abortEarly: false,
			stripUnknown: true,
		});
		if (error) {
			return errorResponse(error.details[0].message, 400, 'VALIDATION_ERROR');
		}
		const { hours } = value;

		const result = await AdminBookingsService.extendBooking(
			parseInt(id, 10),
			hours,
		);

		return NextResponse.json(result);
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
}
