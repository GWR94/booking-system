export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/server/auth/auth';
import { AdminBookingsService } from '@modules';

export const GET = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) => {
	if (!(await isAdmin())) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
	}

	try {
		const { id } = await params;
		const result = await AdminBookingsService.checkBookingExtendAvailability(
			Number(id),
		);

		return NextResponse.json(result);
	} catch (error) {
		console.error('Check extend availability error:', error);

		if (error instanceof Error && error.message === 'Booking not found') {
			return NextResponse.json(
				{ message: 'Booking not found' },
				{ status: 404 },
			);
		}

		return NextResponse.json(
			{
				error: error instanceof Error ? error.message : 'Internal Server Error',
			},
			{ status: 500 },
		);
	}
};
