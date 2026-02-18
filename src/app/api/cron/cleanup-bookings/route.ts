export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@db';
import { Slot } from '@prisma/client';

/**
 * Booking cleanup cron job.
 * Cancels stale bookings that have been in "pending" status for over 15 minutes
 * and releases their associated slots back to "available".
 *
 * Trigger externally via Vercel Cron, GitHub Actions, or cron-job.org
 * with the CRON_SECRET header for authentication.
 */
export const GET = async (req: NextRequest) => {
	// Verify cron secret to prevent unauthorized access
	const authHeader = req.headers.get('authorization');
	if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const thresholdDate = new Date(Date.now() - 15 * 60 * 1000);

		const staleBookings = await db.booking.findMany({
			where: {
				status: 'pending',
				bookingTime: { lt: thresholdDate },
			},
			include: { slots: true },
		});

		if (staleBookings.length === 0) {
			return NextResponse.json({ cleaned: 0, message: 'No stale bookings' });
		}

		console.log(
			`[Cleanup] Found ${staleBookings.length} stale bookings to clean up`,
		);

		for (const booking of staleBookings) {
			console.log(`[Cleanup] Cancelling stale booking ${booking.id}`);

			await db.booking.update({
				where: { id: booking.id },
				data: { status: 'cancelled' },
			});

			const slotIds = booking.slots.map((slot: Slot) => slot.id);
			if (slotIds.length > 0) {
				console.log(
					`[Cleanup] Reverting slots ${slotIds.join(', ')} back to available`,
				);
				await db.slot.updateMany({
					where: { id: { in: slotIds } },
					data: { status: 'available' },
				});
			}
		}

		return NextResponse.json({
			cleaned: staleBookings.length,
			message: `Cleaned up ${staleBookings.length} stale booking(s)`,
		});
	} catch (error) {
		console.error('[Cleanup] Error cleaning up stale bookings:', error);
		return NextResponse.json(
			{
				error: error instanceof Error ? error.message : 'Internal Server Error',
			},
			{ status: 500 },
		);
	}
};
