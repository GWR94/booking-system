export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { isAdmin, getSessionUser } from '@/server/auth/auth';
import { AdminBookingsService } from '@modules';
import { parseWithFirstError } from '@lib/zod';
import { apiAdminLocalBookingSchema } from '@validation/api-schemas';
import { errorResponse } from '../../../_utils/responses';
import { makeAdminBookingLifecycle } from '@/server/modules/booking-lifecycle/admin-booking/admin-booking-lifecycle';

export const POST = async (req: NextRequest) => {
	if (!(await isAdmin())) {
		return errorResponse('Unauthorized', 403, 'FORBIDDEN');
	}

	const currentUser = await getSessionUser();

	if (!currentUser) {
		return errorResponse('User not found', 401, 'AUTH_REQUIRED');
	}

	try {
		const rawBody = await req.json();
		const parsed = parseWithFirstError(apiAdminLocalBookingSchema, rawBody);
		if (!parsed.success) {
			return errorResponse(parsed.message, 400, 'VALIDATION_ERROR');
		}
		const { slotIds } = parsed.data;

		const lifecycle = makeAdminBookingLifecycle({
			adminBookingsService: AdminBookingsService,
		});

		const result = await lifecycle.createLocalBooking({
			user: { role: 'admin' },
			userId: currentUser.id,
			slotIds,
		});

		if (!result.ok) {
			if (result.status === 400 && result.code === 'SLOT_NOT_AVAILABLE') {
				return NextResponse.json(
					{ error: 'SLOT_NOT_AVAILABLE', message: result.message },
					{ status: 400 },
				);
			}

			return errorResponse(result.message, result.status);
		}

		return NextResponse.json(result.value, { status: 201 });
	} catch (error) {
		console.error('Create admin booking error:', error);

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
};
