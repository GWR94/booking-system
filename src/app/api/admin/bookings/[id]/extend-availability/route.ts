export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/server/auth/auth';
import { AdminBookingsService } from '@modules';
import { makeAdminBookingLifecycle } from '@/server/modules/booking-lifecycle/admin-booking/admin-booking-lifecycle';

export const GET = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) => {
	if (!(await isAdmin())) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
	}

	try {
		const { id } = await params;
		const lifecycle = makeAdminBookingLifecycle({
			adminBookingsService: AdminBookingsService,
		});

		const result = await lifecycle.checkBookingExtendAvailability({
			user: { role: 'admin' },
			bookingId: Number(id),
		});

		if (!result.ok) {
			if (result.status === 404) {
				return NextResponse.json({ message: result.message }, { status: 404 });
			}
			return NextResponse.json({ error: result.message }, { status: result.status });
		}

		return NextResponse.json(result.value);
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
