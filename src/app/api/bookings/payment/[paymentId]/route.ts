export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@db';
import { groupSlotsByBay } from '@utils';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ paymentId: string }> },
) {
	try {
		const { paymentId } = await params;

		const booking = await db.booking.findFirst({
			where: { paymentId },
			include: {
				slots: {
					include: {
						bay: true,
					},
				},
				user: true,
			},
		});

		if (!booking) {
			return NextResponse.json(
				{ message: 'Booking not found' },
				{ status: 404 },
			);
		}

		const groupedSlots = groupSlotsByBay(booking.slots as any);

		return NextResponse.json({ booking, groupedSlots });
	} catch (error) {
		console.error('Get booking by payment ID error:', error);
		return NextResponse.json(
			{
				error: error instanceof Error ? error.message : 'Internal Server Error',
			},
			{ status: 500 },
		);
	}
}
