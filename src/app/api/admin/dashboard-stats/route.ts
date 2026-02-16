export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from 'src/server/auth/auth';
import { DashboardService } from '@modules';

export async function GET() {
	if (!(await isAdmin())) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
	}

	try {
		const stats = await DashboardService.getDashboardStats();
		return NextResponse.json(stats);
	} catch (error) {
		console.error('Get dashboard stats error:', error);
		return NextResponse.json(
			{
				error:
					error instanceof Error ? error.message : 'Internal Server Error',
			},
			{ status: 500 },
		);
	}
}
