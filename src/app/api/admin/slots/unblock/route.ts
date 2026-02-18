export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/server/auth/auth';
import { AdminSlotsService } from '@modules';
import { parseWithFirstError } from '@lib/zod';
import { apiAdminSlotBlockSchema } from '@validation/api-schemas';
import { errorResponse } from '../../../_utils/responses';

export const POST = async (req: NextRequest) => {
	if (!(await isAdmin())) {
		return errorResponse('Unauthorized', 403, 'FORBIDDEN');
	}

	try {
		const rawBody = await req.json();
		const parsed = parseWithFirstError(apiAdminSlotBlockSchema, rawBody);
		if (!parsed.success) {
			return errorResponse(parsed.message, 400, 'VALIDATION_ERROR');
		}
		const { startTime, endTime, bayId } = parsed.data;

		const result = await AdminSlotsService.unblockSlots({
			startTime,
			endTime,
			bayId,
		});

		return NextResponse.json(result);
	} catch (error) {
		console.error('Unblock slots error:', error);

		if (error instanceof Error && error.message === 'Invalid date format') {
			return errorResponse('Invalid date format', 400, 'VALIDATION_ERROR');
		}

		return errorResponse(
			error instanceof Error ? error.message : 'Internal Server Error',
			500,
		);
	}
};
