export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/server/auth/auth';
import { AdminSlotsService } from '@modules';
import { parseWithFirstError } from '@lib/zod';
import {
	apiAdminSlotCreateSchema,
	apiAdminSlotsQuerySchema,
} from '@validation/api-schemas';
import { errorResponse } from '../../_utils/responses';
import { makeAdminSlotsLifecycle } from '@/server/modules/booking-lifecycle/admin-slots/admin-slots-lifecycle';

export const GET = async (req: NextRequest) => {
	if (!(await isAdmin())) {
		return errorResponse('Unauthorized', 403, 'FORBIDDEN');
	}

	const searchParams = req.nextUrl.searchParams;
	const raw = {
		date: searchParams.get('date') ?? undefined,
		bayId: searchParams.get('bayId') ?? undefined,
	};
	const parsed = parseWithFirstError(apiAdminSlotsQuerySchema, raw);

	if (!parsed.success) {
		return errorResponse(parsed.message, 400, 'VALIDATION_ERROR');
	}

	const { date, bayId } = parsed.data;

	try {
		const lifecycle = makeAdminSlotsLifecycle({ adminSlotsService: AdminSlotsService });
		const result = await lifecycle.getSlots({
			user: { role: 'admin' },
			date,
			bayId: bayId || undefined,
		});

		if (!result.ok) {
			return NextResponse.json(
				{ error: result.error, ...(result.code ? { code: result.code } : {}) },
				{ status: result.status },
			);
		}

		return NextResponse.json(result.value);
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

		const lifecycle = makeAdminSlotsLifecycle({ adminSlotsService: AdminSlotsService });
		const res = await lifecycle.createSlot({
			user: { role: 'admin' },
			startTime,
			endTime,
			status,
			bay,
		});

		if (!res.ok) {
			return errorResponse(res.error, res.status, res.code);
		}

		return NextResponse.json(res.value, { status: 201 });
	} catch (error) {
		console.error('Create slot error:', error);
		return errorResponse(
			error instanceof Error ? error.message : 'Internal Server Error',
			500,
		);
	}
};
