export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/server/auth/auth';
import { AdminSlotsService } from '@modules';
import { parseWithFirstError } from '@lib/zod';
import { apiAdminSlotCreateSchema } from '@validation/api-schemas';
import { errorResponse } from '../../_utils/responses';

export const GET = async (req: NextRequest) => {
	if (!(await isAdmin())) {
		return errorResponse('Unauthorized', 403, 'FORBIDDEN');
	}

	const searchParams = req.nextUrl.searchParams;
	const date = searchParams.get('date');
	const bayId = searchParams.get('bayId');

	try {
		if (!date) {
			return NextResponse.json(
				{ error: 'Date is required', code: 'VALIDATION_ERROR' },
				{ status: 400 },
			);
		}

		const slots = await AdminSlotsService.getAdminSlots({
			date,
			bayId: bayId || undefined,
		});

		return NextResponse.json(slots);
	} catch (error) {
		console.error('Get admin slots error:', error);
		return NextResponse.json(
			{
				error: error instanceof Error ? error.message : 'Internal Server Error',
			},
			{ status: 500 },
		);
	}
};

export const POST = async (req: NextRequest) => {
	if (!(await isAdmin())) {
		return errorResponse('Unauthorized', 403, 'FORBIDDEN');
	}

	try {
		const rawBody = await req.json();
		const parsed = parseWithFirstError(apiAdminSlotCreateSchema, rawBody);
		if (!parsed.success) {
			return errorResponse(parsed.message, 400, 'VALIDATION_ERROR');
		}
		const { startTime, endTime, status = 'available', bay } = parsed.data;

		const result = await AdminSlotsService.createSlot({
			startTime,
			endTime,
			status,
			bay,
		});

		return NextResponse.json(result, { status: 201 });
	} catch (error) {
		console.error('Create slot error:', error);
		return errorResponse(
			error instanceof Error ? error.message : 'Internal Server Error',
			500,
		);
	}
};
