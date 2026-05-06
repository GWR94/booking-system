import { Slot } from '@prisma/client';
import type {
	Actor,
	BookingLifecycle,
	BookingLifecycleDeps,
	CancelResult,
	CleanupResult,
	Logger,
} from './types';

export type {
	Actor,
	BookingLifecycle,
	BookingLifecycleDeps,
	CancelResult,
	CleanupResult,
};

export function makeBookingLifecycle(deps: BookingLifecycleDeps): BookingLifecycle {
	const log = deps.logger ?? console;
	const now = () => (deps.clock?.now ? deps.clock.now() : new Date());
	const requireDb = () => {
		if (!deps.db) throw new Error('db dependency not configured');
		return deps.db;
	};

	const lifecycle: BookingLifecycle = {
		async createPendingBooking({
			slotIds,
			paymentId,
			paymentStatus,
			userId,
			guestInfo,
		}) {
			if (!deps.bookingService?.createBooking) {
				throw new Error('bookingService dependency not configured');
			}

			try {
				const booking = await deps.bookingService.createBooking({
					userId,
					slotIds,
					paymentId,
					paymentStatus,
					guestInfo,
				});
				return { ok: true, booking };
			} catch (err: unknown) {
				return {
					ok: false,
					status: 500,
					error: err instanceof Error ? err.message : 'Internal Server Error',
				};
			}
		},

		async cancelBooking({ bookingId, actor }) {
			const db = requireDb();
			const booking = await db.booking.findUnique({
				where: { id: bookingId },
				include: {
					slots: { orderBy: { startTime: 'asc' } },
					user: { select: { email: true, name: true } },
				},
			});

			if (!booking) {
				return { ok: false, status: 404, error: 'Booking not found' };
			}

			// Verify ownership (admins can cancel anything)
			if (booking.userId !== actor.userId && actor.role !== 'admin') {
				return { ok: false, status: 403, error: 'Forbidden' };
			}

			const firstSlot = booking.slots[0] as { startTime: Date | string } | undefined;

			let refundWarning: string | undefined;
			let refundStatus: CancelResult['refundStatus'] = 'not_applicable';

			if (firstSlot && booking.paymentId) {
				const slotTime = new Date(firstSlot.startTime).getTime();
				const hoursUntilBooking =
					(slotTime - now().getTime()) / (1000 * 60 * 60);

				if (hoursUntilBooking >= 24) {
					try {
						if (!deps.stripe?.refunds?.create) {
							throw new Error('Stripe dependency not configured');
						}
						await deps.stripe.refunds.create(
							{ payment_intent: booking.paymentId },
							{ idempotencyKey: `refund-booking-${bookingId}` },
						);
						refundStatus = 'refunded';
					} catch (error) {
						log.error('Stripe refund failed:', error);
						refundWarning =
							'Booking cancelled, but automatic refund failed. Please contact support.';
						refundStatus = 'failed';
						try {
							if (deps.sendRefundFailedAlert) {
								await deps.sendRefundFailedAlert({
									bookingId,
									paymentId: booking.paymentId,
									userEmail:
										booking.user?.email ?? booking.guestEmail ?? 'unknown',
								});
							}
						} catch (emailErr) {
							log.error('Failed to send refund-failed alert email:', emailErr);
						}
					}
				} else {
					refundStatus = 'not_refunded_policy';
				}
			}

			const slotIds = (booking.slots as Slot[]).map((slot) => slot.id);
			if (slotIds.length > 0) {
				await db.slot.updateMany({
					where: { id: { in: slotIds } },
					data: { status: 'available' },
				});
			}

			await db.booking.update({
				where: { id: booking.id },
				data: {
					status: 'cancelled',
					...(refundStatus === 'failed' && { refundFailedAt: new Date() }),
				},
			});

			return { ok: true, result: { refundStatus, refundWarning } };
		},

		async cleanupStalePendingBookings({ olderThanMinutes }) {
			try {
				const db = requireDb();
				const thresholdDate = new Date(now().getTime() - olderThanMinutes * 60 * 1000);

				const staleBookings = await db.booking.findMany({
					where: {
						status: 'pending',
						bookingTime: { lt: thresholdDate },
					},
					include: { slots: true },
				});

				for (const booking of staleBookings) {
					await db.booking.update({
						where: { id: booking.id },
						data: { status: 'cancelled' },
					});

					const slotIds = (booking.slots as Slot[]).map((slot) => slot.id);
					if (slotIds.length > 0) {
						await db.slot.updateMany({
							where: { id: { in: slotIds } },
							data: { status: 'available' },
						});
					}
				}

				return { ok: true, result: { cleaned: staleBookings.length } };
			} catch (error) {
				log.error('[Cleanup] Error cleaning up stale bookings:', error);
				return {
					ok: false,
					status: 500,
					error: error instanceof Error ? error.message : 'Internal Server Error',
				};
			}
		},

		async confirmPaid({ bookingId, paymentId, paymentStatus }) {
			if (!deps.bookingService) {
				throw new Error('bookingService dependency not configured');
			}
			const db = requireDb();
			const existing = await db.booking.findUnique({
				where: { id: bookingId },
				select: { status: true },
			});
			if (existing?.status !== 'confirmed') {
				await deps.bookingService.confirmBooking(bookingId, paymentId, paymentStatus);
			}
		},

		async markPaymentFailed({ bookingId }) {
			if (!deps.bookingService) {
				throw new Error('bookingService dependency not configured');
			}
			const db = requireDb();
			const existing = await db.booking.findUnique({
				where: { id: bookingId },
				select: { status: true },
			});
			if (existing?.status !== 'failed') {
				await deps.bookingService.handleFailedPayment(bookingId);
			}
		},

		async handlePaymentIntentCreated({
			paymentIntentId,
			paymentStatus,
			metadata,
		}) {
			if (!deps.bookingService) {
				throw new Error('bookingService dependency not configured');
			}
			const db = requireDb();
			if (!deps.stripe?.paymentIntents) {
				log.error('Stripe dependency not configured for payment intent metadata updates');
				return;
			}

			// If we already have a booking id in metadata -> event already handled.
			const bookingIdRaw = metadata.bookingId;
			if (typeof bookingIdRaw === 'string' && bookingIdRaw.trim()) {
				return;
			}

			// Idempotency: if we already created a booking for this payment intent (Stripe redelivery), skip creation
			const existingBooking = await db.booking.findFirst({
				where: { paymentId: paymentIntentId },
				select: { id: true },
			});
			if (existingBooking) {
				// Ensure Stripe has bookingId in metadata (in case first run succeeded in DB but failed before update)
				await deps.stripe.paymentIntents.update(paymentIntentId, {
					metadata: {
						...metadata,
						bookingId: existingBooking.id.toString(),
					},
				});
				return;
			}

			const userIdRaw = metadata.userId;
			const slotIdsRaw = metadata.slotIds;
			const isGuestRaw = metadata.isGuest;
			const guestNameRaw = metadata.guestName;
			const guestEmailRaw = metadata.guestEmail;
			const guestPhoneRaw = metadata.guestPhone;

			const slotIdsStr =
				typeof slotIdsRaw === 'string' ? slotIdsRaw.trim() : '';
			if (!slotIdsStr) {
				log.error('payment_intent.created missing/invalid slotIds metadata');
				return;
			}
			let slotIds: number[] = [];
			try {
				slotIds = JSON.parse(slotIdsStr) as number[];
			} catch {
				log.error('payment_intent.created missing/invalid slotIds metadata');
				return;
			}

			let booking: { id: number };
			if (isGuestRaw === 'true') {
				const name = typeof guestNameRaw === 'string' ? guestNameRaw : '';
				const email = typeof guestEmailRaw === 'string' ? guestEmailRaw : '';
				if (!name || !email) {
					log.error('Guest payment intent missing guestName or guestEmail in metadata');
					return;
				}

				booking = await deps.bookingService.createBooking({
					slotIds,
					paymentId: paymentIntentId,
					paymentStatus,
					guestInfo: {
						name,
						email,
						phone: typeof guestPhoneRaw === 'string' ? guestPhoneRaw : undefined,
					},
				});
			} else {
				booking = await deps.bookingService.createBooking({
					userId: Number(userIdRaw),
					slotIds,
					paymentId: paymentIntentId,
					paymentStatus,
				});
			}

			await deps.stripe.paymentIntents.update(paymentIntentId, {
				metadata: { ...metadata, bookingId: booking.id.toString() },
			});
		},

		async handlePaymentIntentSucceeded({
			paymentIntentId,
			paymentStatus,
			metadata,
		}) {
			if (!deps.bookingService) {
				throw new Error('bookingService dependency not configured');
			}

			// When succeeded/failed arrive without `metadata.bookingId`, we still want to
			// create (or backfill) the booking using payment_intent.created logic.
			const bookingIdRaw = metadata.bookingId;
			const hasBookingId =
				typeof bookingIdRaw === 'string' && bookingIdRaw.trim().length > 0;

			if (!hasBookingId) {
				await lifecycle.handlePaymentIntentCreated({
					paymentIntentId,
					paymentStatus,
					metadata,
				});
			}

			const db = requireDb();
			const booking = await db.booking.findFirst({
				where: { paymentId: paymentIntentId },
				select: { id: true, status: true },
			});

			if (!booking) {
				log.error('Booking not found for succeeded payment intent', {
					paymentIntentId,
				});
				return;
			}

			if (booking.status !== 'confirmed') {
				await deps.bookingService.confirmBooking(
					booking.id,
					paymentIntentId,
					paymentStatus,
				);
			}
		},

		async handlePaymentIntentFailed({
			paymentIntentId,
			paymentStatus,
			metadata,
		}) {
			if (!deps.bookingService) {
				throw new Error('bookingService dependency not configured');
			}

			const bookingIdRaw = metadata.bookingId;
			const hasBookingId =
				typeof bookingIdRaw === 'string' && bookingIdRaw.trim().length > 0;

			if (!hasBookingId) {
				await lifecycle.handlePaymentIntentCreated({
					paymentIntentId,
					paymentStatus,
					metadata,
				});
			}

			const db = requireDb();
			const booking = await db.booking.findFirst({
				where: { paymentId: paymentIntentId },
				select: { id: true, status: true },
			});

			if (!booking) {
				log.error('Booking not found for failed payment intent', {
					paymentIntentId,
				});
				return;
			}

			if (booking.status !== 'failed') {
				await deps.bookingService.handleFailedPayment(booking.id);
			}
		},
	};

	return lifecycle;
}

