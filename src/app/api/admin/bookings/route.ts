export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from 'src/server/auth/auth';
import { AdminBookingsService } from '@modules';

export async function GET(req: NextRequest) {
	if (!(await isAdmin())) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
	}

	const searchParams = req.nextUrl.searchParams;
	const page = parseInt(searchParams.get('page') || '1', 10);
	const limit = parseInt(searchParams.get('limit') || '10', 10);
	const search = searchParams.get('search') || '';

	try {
		const result = await AdminBookingsService.getAllBookings({
			page,
			limit,
			search,
		});

		return NextResponse.json(result);
	} catch (error) {
		console.error('Get admin bookings error:', error);
		return NextResponse.json(
			{
				error: error instanceof Error ? error.message : 'Internal Server Error',
			},
			{ status: 500 },
		);
	}
}
