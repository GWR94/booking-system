export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from 'src/server/auth/auth';
import { AdminBookingsService } from '@modules';
import { apiAdminBookingStatusSchema } from '@validation/api-schemas';
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
		const { error, value } = apiAdminBookingStatusSchema.validate(rawBody, {
			abortEarly: false,
			stripUnknown: true,
		});
		if (error) {
			return errorResponse(error.details[0].message, 400, 'VALIDATION_ERROR');
		}
		const { status } = value;

		const result = await AdminBookingsService.updateBookingStatus(
			parseInt(id, 10),
			status,
		);

		return NextResponse.json(result);
	} catch (error) {
		console.error('Update booking status error:', error);
		return errorResponse(
			error instanceof Error ? error.message : 'Internal Server Error',
			500,
		);
	}
}
