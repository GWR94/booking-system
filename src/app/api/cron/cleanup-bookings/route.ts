export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@db';
import { makeBookingLifecycle } from '@/server/modules/booking-lifecycle/booking/booking-lifecycle';
import { sendPendingPaymentReminder } from '@utils/email';
import { getEmailSiteUrl } from '@utils/site-url';

/**
 * Booking cleanup cron job.
 * Cancels stale bookings that have been in "pending" status for over 15 minutes
 * and releases their associated slots back to "available".
 *
 * Trigger externally via Vercel Cron, GitHub Actions, or cron-job.org
 * with the CRON_SECRET header for authentication.
 */
export const GET = async (req: NextRequest) => {
	// Skip work during build (no CRON_SECRET) so "Collecting page data" doesn't fail
	if (!process.env.CRON_SECRET) {
		return NextResponse.json({ cleaned: 0, message: 'Cron not configured' });
	}
	// Verify cron secret to prevent unauthorized access
	const authHeader = req.headers.get('authorization');
	if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const lifecycle = makeBookingLifecycle({ db });
		const result = await lifecycle.cleanupStalePendingBookings({
			olderThanMinutes: 15,
		});

		if (!result.ok) {
			return NextResponse.json({ error: result.error }, { status: result.status });
		}

		if (result.result.cleaned === 0) {
			// Continue to reminder dispatch even if nothing was cleaned.
		}

		const reminderCutoff = new Date(Date.now() - 10 * 60 * 1000);
		const candidates = await db.booking.findMany({
			where: {
				status: 'pending',
				paymentId: { not: null },
				reminderSentAt: null,
				bookingTime: { lte: reminderCutoff },
			},
			include: {
				user: { select: { email: true } },
				slots: {
					orderBy: { endTime: 'desc' },
					select: { endTime: true },
				},
			},
			orderBy: { bookingTime: 'desc' },
			take: 50,
		});

		const baseUrl = getEmailSiteUrl();
		let reminded = 0;
		for (const booking of candidates) {
			const recipientEmail = booking.user?.email ?? booking.guestEmail ?? null;
			const expiresAt = booking.slots[0]?.endTime ?? null;
			if (!recipientEmail || !expiresAt) continue;
			if (new Date(expiresAt).getTime() <= Date.now()) continue;

			await sendPendingPaymentReminder({
				bookingId: booking.id,
				recipientEmail,
				resumeUrl: `${baseUrl}/profile/bookings`,
				expiresAt: new Date(expiresAt),
			});

			await db.booking.update({
				where: { id: booking.id },
				data: { reminderSentAt: new Date() },
			});
			reminded += 1;
		}

		return NextResponse.json({
			cleaned: result.result.cleaned,
			reminded,
			message:
				result.result.cleaned === 0
					? reminded > 0
						? `Sent ${reminded} pending payment reminder(s)`
						: 'No stale bookings'
					: `Cleaned up ${result.result.cleaned} stale booking(s)`,
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
