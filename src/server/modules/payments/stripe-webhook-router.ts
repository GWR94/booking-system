import Stripe from 'stripe';

import type { BookingStripePaymentsDeps } from './booking-stripe-payments';

type StripeWebhookRouter = {
	routeEvent: (event: Stripe.Event) => Promise<void>;
};

function extractBookingId(metadata: Stripe.Metadata | undefined): number | undefined {
	const bookingIdRaw = metadata?.bookingId;
	if (typeof bookingIdRaw !== 'string') return undefined;
	const trimmed = bookingIdRaw.trim();
	if (!trimmed) return undefined;
	const asNumber = Number(trimmed);
	return Number.isFinite(asNumber) ? asNumber : undefined;
}

export function makeStripeWebhookRouter(deps: BookingStripePaymentsDeps): StripeWebhookRouter {
	return {
		async routeEvent(event) {
			const { db, bookingService, membershipService, bookingLifecycle } = deps;
			const log = deps.logger ?? console;

			switch (event.type) {
				case 'payment_intent.succeeded': {
					const payment = event.data.object as Stripe.PaymentIntent;
					if (bookingLifecycle) {
						await bookingLifecycle.handlePaymentIntentSucceeded({
							paymentIntentId: payment.id,
							paymentStatus: payment.status,
							metadata: payment.metadata ?? {},
						});
					} else {
						const bookingId = extractBookingId(payment.metadata);
						if (bookingId == null) break;

						const existing = await db.booking.findUnique({
							where: { id: bookingId },
							select: { status: true },
						});
						if (existing?.status !== 'confirmed') {
							await bookingService.confirmBooking(bookingId, payment.id, payment.status);
						}
					}
					break;
				}

				case 'payment_intent.created': {
					const payment = event.data.object as Stripe.PaymentIntent;
					if (!bookingLifecycle) {
						log.warn(
							'payment_intent.created received but bookingLifecycle is not configured',
						);
						return;
					}

					await bookingLifecycle.handlePaymentIntentCreated({
						paymentIntentId: payment.id,
						paymentStatus: payment.status,
						metadata: payment.metadata ?? {},
					});
					break;
				}

				case 'payment_intent.payment_failed': {
					const payment = event.data.object as Stripe.PaymentIntent;
					if (bookingLifecycle) {
						await bookingLifecycle.handlePaymentIntentFailed({
							paymentIntentId: payment.id,
							paymentStatus: payment.status,
							metadata: payment.metadata ?? {},
						});
					} else {
						const bookingId = extractBookingId(payment.metadata);
						if (bookingId == null) break;

						const existing = await db.booking.findUnique({
							where: { id: bookingId },
							select: { status: true },
						});
						if (existing?.status !== 'failed') {
							await bookingService.handleFailedPayment(bookingId);
						}
					}
					break;
				}

				case 'customer.subscription.created':
				case 'customer.subscription.updated':
				case 'customer.subscription.deleted': {
					const subscription = event.data.object as Stripe.Subscription;
					await membershipService.handleMembershipUpdate(subscription);
					break;
				}

				default:
					log.warn(`Unhandled event type ${event.type}.`);
					break;
			}
		},
	};
}

