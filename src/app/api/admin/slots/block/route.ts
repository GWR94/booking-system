export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from 'src/server/auth/auth';
import { AdminSlotsService } from '@modules';
import { apiAdminSlotBlockSchema } from '@validation/api-schemas';
import { errorResponse } from '../../../_utils/responses';

export async function POST(req: NextRequest) {
	if (!(await isAdmin())) {
		return errorResponse('Unauthorized', 403, 'FORBIDDEN');
	}

	try {
		const rawBody = await req.json();
		const { error, value } = apiAdminSlotBlockSchema.validate(rawBody, {
			abortEarly: false,
			stripUnknown: true,
		});
		if (error) {
			return errorResponse(error.details[0].message, 400, 'VALIDATION_ERROR');
		}
		const { startTime, endTime, bayId } = value;

		const result = await AdminSlotsService.blockSlots({
			startTime,
			endTime,
			bayId,
		});

		return NextResponse.json(result);
	} catch (error) {
		console.error('Block slots error:', error);

		if (error instanceof Error && error.message === 'Invalid date format') {
			return errorResponse('Invalid date format', 400, 'VALIDATION_ERROR');
		}

		return errorResponse(
			error instanceof Error ? error.message : 'Internal Server Error',
			500,
		);
	}
}
