export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/server/auth/auth';
import { AdminBookingsService } from '@modules';
import { parseWithFirstError } from '@/server/lib/zod';
import { apiAdminBookingsQuerySchema } from '@/validation/api-schemas';
import { makeAdminBookingLifecycle } from '@/server/modules/booking-lifecycle/admin-booking/admin-booking-lifecycle';

export const GET = async (req: NextRequest) => {
	if (!(await isAdmin())) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
	}

	const searchParams = req.nextUrl.searchParams;
	const raw = {
		page: searchParams.get('page') ?? undefined,
		limit: searchParams.get('limit') ?? undefined,
		search: searchParams.get('search') ?? undefined,
	};

	const query = parseWithFirstError(apiAdminBookingsQuerySchema, raw);

	if (!query.success) {
		return NextResponse.json({ error: query.message }, { status: 400 });
	}

	try {
		const { search, ...rest } = query.data;
		const lifecycle = makeAdminBookingLifecycle({
			adminBookingsService: AdminBookingsService,
		});

		const result = await lifecycle.getAllBookings({
			user: { role: 'admin' },
			...rest,
			search: search ?? null,
		});

		if (!result.ok) {
			return NextResponse.json({ error: result.message }, { status: result.status });
		}

		return NextResponse.json(result.value);
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
