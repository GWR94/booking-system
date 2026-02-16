export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@db';

export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const from = searchParams.get('from');
	const to = searchParams.get('to');
	const ids = searchParams.get('ids');

	try {
		if (ids) {
			const idsArray = ids.split(',').map((id) => parseInt(id, 10));
			const slots = await db.slot.findMany({
				where: {
					id: { in: idsArray },
				},
				orderBy: { startTime: 'asc' },
			});
			return NextResponse.json(slots);
		}

		if (!from || isNaN(Date.parse(from))) {
			return NextResponse.json(
				{ error: 'A valid "from" date is required', from },
				{ status: 400 },
			);
		}

		if (!to || isNaN(Date.parse(to))) {
			return NextResponse.json(
				{ error: 'A valid "to" date is required', to },
				{ status: 400 },
			);
		}

		const slots = await db.slot.findMany({
			where: {
				startTime: {
					lte: to,
					gte: from,
				},
				status: 'available',
			},
			orderBy: { startTime: 'asc' },
		});

		return NextResponse.json(slots);
	} catch (error) {
		console.error('Error fetching slots:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		);
	}
}
