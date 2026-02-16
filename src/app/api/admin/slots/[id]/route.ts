import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { isAdmin } from 'src/server/auth/auth';
import { AdminSlotsService } from '@modules';
import { apiAdminSlotUpdateSchema } from '@validation/api-schemas';
import { errorResponse } from '../../../_utils/responses';

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id: idParam } = await params;
	if (!(await isAdmin())) {
		return errorResponse('Unauthorized', 403, 'FORBIDDEN');
	}

	try {
		const id = parseInt(idParam, 10);
		if (Number.isNaN(id)) {
			return errorResponse('Invalid slot id', 400, 'VALIDATION_ERROR');
		}
		const rawBody = await req.json();
		const { error, value } = apiAdminSlotUpdateSchema.validate(rawBody, {
			abortEarly: false,
			stripUnknown: true,
		});
		if (error) {
			return errorResponse(error.details[0].message, 400, 'VALIDATION_ERROR');
		}
		const { startTime, endTime, status, bay } = value;

		const result = await AdminSlotsService.updateSlot(id, {
			startTime,
			endTime,
			status,
			bay,
		});

		return NextResponse.json(result);
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
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id: idParam } = await params;
	if (!(await isAdmin())) {
		return errorResponse('Unauthorized', 403, 'FORBIDDEN');
	}

	try {
		const id = parseInt(idParam, 10);
		if (Number.isNaN(id)) {
			return errorResponse('Invalid slot id', 400, 'VALIDATION_ERROR');
		}
		const result = await AdminSlotsService.deleteSlot(id);

		return NextResponse.json(result);
	} catch (error) {
		console.error('Delete slot error:', error);
		return errorResponse(
			error instanceof Error ? error.message : 'Internal Server Error',
			500,
		);
	}
}
