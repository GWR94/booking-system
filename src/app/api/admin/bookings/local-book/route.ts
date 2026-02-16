export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { isAdmin, getSessionUser } from 'src/server/auth/auth';
import { AdminBookingsService } from '@modules';
import { apiAdminLocalBookingSchema } from '@validation/api-schemas';
import { errorResponse } from '../../../_utils/responses';

export async function POST(req: NextRequest) {
	if (!(await isAdmin())) {
		return errorResponse('Unauthorized', 403, 'FORBIDDEN');
	}

	const currentUser = await getSessionUser();

	if (!currentUser) {
		return errorResponse('User not found', 401, 'AUTH_REQUIRED');
	}

	try {
		const rawBody = await req.json();
		const { error, value } = apiAdminLocalBookingSchema.validate(rawBody, {
			abortEarly: false,
			stripUnknown: true,
		});
		if (error) {
			return errorResponse(error.details[0].message, 400, 'VALIDATION_ERROR');
		}
		const { slotIds } = value;

		const result = await AdminBookingsService.createAdminBooking(
			currentUser.id,
			slotIds,
		);

		return NextResponse.json(result, { status: 201 });
	} catch (error) {
		console.error('Create admin booking error:', error);

		// Handle specific error cases
		if (error instanceof Error && error.message.includes('not available')) {
			return NextResponse.json(
				{
					error: 'SLOT_NOT_AVAILABLE',
					message: error.message,
				},
				{ status: 400 },
			);
		}

		return errorResponse(
			error instanceof Error ? error.message : 'Internal Server Error',
			500,
		);
	}
}
