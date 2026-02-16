export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from 'src/server/auth/auth';
import { AdminUsersService } from '@modules';

export async function POST(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	if (!(await isAdmin())) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
	}

	try {
		const { id } = await params;
		const userId = parseInt(id, 10);

		const result = await AdminUsersService.resetUserPassword(userId);

		return NextResponse.json(result);
	} catch (error) {
		console.error('Reset password error:', error);

		if (error instanceof Error) {
			if (error.message === 'User not found') {
				return NextResponse.json({ message: 'User not found' }, { status: 404 });
			}
			if (error.message === 'User has no email address') {
				return NextResponse.json(
					{ message: 'User has no email address' },
					{ status: 400 },
				);
			}
		}

		return NextResponse.json(
			{ error: error instanceof Error ? error.message : 'Internal Server Error' },
			{ status: 500 },
		);
	}
}
