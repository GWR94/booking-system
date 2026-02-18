export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/server/auth/auth';
import { AdminBookingsService } from '@modules';

export const GET = async (req: NextRequest) => {
	if (!(await isAdmin())) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
	}

	const searchParams = req.nextUrl.searchParams;
	const page = Number(searchParams.get('page') || '1');
	const limit = Number(searchParams.get('limit') || '10');
	const search = searchParams.get('search') as string | undefined;

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
};
