export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@db';
import { parseWithFirstError } from '@lib/zod';
import { apiSlotsQuerySchema } from '@validation/api-schemas';

export const GET = async (req: NextRequest) => {
	const searchParams = req.nextUrl.searchParams;
	const raw = {
		from: searchParams.get('from') ?? undefined,
		to: searchParams.get('to') ?? undefined,
		ids: searchParams.get('ids') ?? undefined,
	};

	const parsed = parseWithFirstError(apiSlotsQuerySchema, raw);

	if (!parsed.success) {
		return NextResponse.json({ error: parsed.message }, { status: 400 });
	}

	const { from, to, ids } = parsed.data;

	try {
		if (ids) {
			const idsArray = ids.split(',').map((id) => Number(id));
			const slotsByIds = await db.slot.findMany({
				where: {
					id: { in: idsArray },
				},
				orderBy: { startTime: 'asc' },
			});
			return NextResponse.json(slotsByIds);
		}

		if (from === undefined || to === undefined) {
			return NextResponse.json(
				{ error: 'Both from and to (ISO date-time) are required when ids is not provided' },
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
};
