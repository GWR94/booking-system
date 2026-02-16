export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from 'src/server/auth/auth';
import { AdminUsersService } from '@modules';

export async function GET() {
	if (!(await isAdmin())) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
	}

	try {
		const users = await AdminUsersService.getAllUsers();

		return NextResponse.json(users);
	} catch (error) {
		console.error('Get users error:', error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : 'Internal Server Error' },
			{ status: 500 },
		);
	}
}
