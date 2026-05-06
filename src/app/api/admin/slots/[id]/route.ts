import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { isAdmin } from '@/server/auth/auth';
import { AdminSlotsService } from '@modules';
import { parseWithFirstError } from '@lib/zod';
import { apiAdminSlotUpdateSchema } from '@validation/api-schemas';
import { errorResponse } from '../../../_utils/responses';
import { makeAdminSlotsLifecycle } from '@/server/modules/booking-lifecycle/admin-slots/admin-slots-lifecycle';

export const PUT = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) => {
	const { id: idParam } = await params;
	if (!(await isAdmin())) {
		return errorResponse('Unauthorized', 403, 'FORBIDDEN');
	}

	try {
		const id = Number(idParam);
		if (Number.isNaN(id)) {
			return errorResponse('Invalid slot id', 400, 'VALIDATION_ERROR');
		}
		const rawBody = await req.json();
		const parsed = parseWithFirstError(apiAdminSlotUpdateSchema, rawBody);
		if (!parsed.success) {
			return errorResponse(parsed.message, 400, 'VALIDATION_ERROR');
		}
		const value = parsed.data;
		const { startTime, endTime, status, bay } = value;

		const lifecycle = makeAdminSlotsLifecycle({ adminSlotsService: AdminSlotsService });
		const res = await lifecycle.updateSlot({
			user: { role: 'admin' },
			slotId: id,
			startTime,
			endTime,
			status,
			bay,
		});

		if (!res.ok) {
			return errorResponse(res.error, res.status, res.code);
		}

		return NextResponse.json(res.value);
	} catch (error) {
		console.error('Update slot error:', error);

		if (error instanceof Error && error.message.includes('Invalid')) {
			return errorResponse(error.message, 400, 'VALIDATION_ERROR');
		}

		return errorResponse(
			error instanceof Error ? error.message : 'Internal Server Error',
			500,
		);
	}
};

export const DELETE = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) => {
	const { id: idParam } = await params;
	if (!(await isAdmin())) {
		return errorResponse('Unauthorized', 403, 'FORBIDDEN');
	}

	try {
		const id = Number(idParam);
		if (Number.isNaN(id)) {
			return errorResponse('Invalid slot id', 400, 'VALIDATION_ERROR');
		}

		const lifecycle = makeAdminSlotsLifecycle({ adminSlotsService: AdminSlotsService });
		const res = await lifecycle.deleteSlot({
			user: { role: 'admin' },
			slotId: id,
		});

		if (!res.ok) {
			return errorResponse(res.error, res.status, res.code);
		}

		return NextResponse.json(res.value);
	} catch (error) {
		console.error('Delete slot error:', error);
		return errorResponse(
			error instanceof Error ? error.message : 'Internal Server Error',
			500,
		);
	}
};
