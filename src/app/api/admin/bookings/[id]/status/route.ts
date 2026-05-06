export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/server/auth/auth';
import { AdminBookingsService } from '@modules';
import { parseWithFirstError } from '@lib/zod';
import { apiAdminBookingStatusSchema } from '@validation/api-schemas';
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
		const parsed = parseWithFirstError(apiAdminBookingStatusSchema, rawBody);
		if (!parsed.success) {
			return errorResponse(parsed.message, 400, 'VALIDATION_ERROR');
		}
		const { status } = parsed.data;

		const lifecycle = makeAdminBookingLifecycle({
			adminBookingsService: AdminBookingsService,
		});

		const result = await lifecycle.updateBookingStatus({
			user: { role: 'admin' },
			bookingId: Number(id),
			status,
		});

		if (!result.ok) {
			return errorResponse(result.message, result.status);
		}

		return NextResponse.json(result.value);
	} catch (error) {
		console.error('Update booking status error:', error);
		return errorResponse(
			error instanceof Error ? error.message : 'Internal Server Error',
			500,
		);
	}
};
