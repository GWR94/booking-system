export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from 'src/server/auth/auth';
import { AdminUsersService } from '@modules';
import { apiAdminUserUpdateSchema } from '@validation/api-schemas';
import { errorResponse } from '../../../_utils/responses';

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	if (!(await isAdmin())) {
		return errorResponse('Unauthorized', 403, 'FORBIDDEN');
	}

	try {
		const { id } = await params;
		const userId = parseInt(id, 10);
		if (Number.isNaN(userId)) {
			return errorResponse('Invalid user id', 400, 'VALIDATION_ERROR');
		}

		const rawBody = await req.json();
		const { error, value } = apiAdminUserUpdateSchema.validate(rawBody, {
			abortEarly: false,
			stripUnknown: true,
		});
		if (error) {
			return errorResponse(error.details[0].message, 400, 'VALIDATION_ERROR');
		}
		const body = value;
		const { name, email, role, membershipTier, membershipStatus } = body;

		const result = await AdminUsersService.updateUserDetails(userId, {
			name,
			email,
			role,
			membershipTier,
			membershipStatus,
		});

		return NextResponse.json(result);
	} catch (error) {
		console.error('Update user error:', error);

		if (error instanceof Error && error.message === 'User not found') {
			return errorResponse('User not found', 404, 'NOT_FOUND');
		}

		return errorResponse(
			error instanceof Error ? error.message : 'Internal Server Error',
			500,
		);
	}
}
