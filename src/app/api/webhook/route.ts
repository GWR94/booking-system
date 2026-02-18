export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@db';
import { BookingService } from '@modules';
import { MembershipService } from '@modules';
import { getStripe } from '@lib/stripe';

export const POST = async (req: NextRequest) => {
	const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
	try {
		const signature = req.headers.get('stripe-signature');

		if (!signature || !endpointSecret) {
			return NextResponse.json(
				{ error: 'Missing signature or secret' },
				{ status: 400 },
			);
		}

		const rawBody = await req.text();

		const stripe = getStripe();
		let event: Stripe.Event;

		try {
			event = stripe.webhooks.constructEvent(
				rawBody,
				signature,
				endpointSecret,
			);
		} catch (err: any) {
			console.error(
				`⚠️  Webhook signature verification failed. ${err.message}`,
			);
			return NextResponse.json(
				{ error: 'Webhook signature verification failed' },
				{ status: 400 },
			);
		}

		switch (event.type) {
			case 'payment_intent.succeeded': {
				const payment = event.data.object as Stripe.PaymentIntent;
				const { bookingId } = payment.metadata;

				if (bookingId) {
					const existing = await db.booking.findUnique({
						where: { id: Number(bookingId) },
						select: { status: true },
					});
					if (existing?.status !== 'confirmed') {
						await BookingService.confirmBooking(
							Number(bookingId),
							payment.id,
							payment.status,
						);
					}
				}
				break;
			}
			case 'payment_intent.created': {
				const payment = event.data.object as Stripe.PaymentIntent;
				const {
					bookingId,
					userId,
					slotIds,
					isGuest,
					guestName,
					guestEmail,
					guestPhone,
				} = payment.metadata;

				if (bookingId) {
					break;
				}

				let booking;
				if (isGuest === 'true') {
					const name = typeof guestName === 'string' ? guestName : '';
					const email = typeof guestEmail === 'string' ? guestEmail : '';
					if (!name || !email) {
						console.error(
							'Guest payment intent missing guestName or guestEmail in metadata',
						);
						break;
					}
					booking = await BookingService.createBooking({
						slotIds: JSON.parse(slotIds),
						paymentId: payment.id,
						paymentStatus: payment.status,
						guestInfo: {
							name,
							email,
							phone: typeof guestPhone === 'string' ? guestPhone : undefined,
						},
					});
				} else {
					booking = await BookingService.createBooking({
						userId: Number(userId),
						slotIds: JSON.parse(slotIds),
						paymentId: payment.id,
						paymentStatus: payment.status,
					});
				}

				const stripe = getStripe();
				await stripe.paymentIntents.update(payment.id, {
					metadata: { ...payment.metadata, bookingId: booking.id.toString() },
				});
				break;
			}
			case 'payment_intent.payment_failed': {
				const payment = event.data.object as Stripe.PaymentIntent;
				const { bookingId } = payment.metadata;

				if (bookingId) {
					const existing = await db.booking.findUnique({
						where: { id: Number(bookingId) },
						select: { status: true },
					});
					if (existing?.status !== 'failed') {
						await BookingService.handleFailedPayment(Number(bookingId));
					}
				}
				break;
			}
			case 'customer.subscription.created':
			case 'customer.subscription.updated':
			case 'customer.subscription.deleted': {
				const subscription = event.data.object as Stripe.Subscription;
				await MembershipService.handleMembershipUpdate(subscription);
				break;
			}
			default:
				console.warn(`Unhandled event type ${event.type}.`);
				break;
		}

		return NextResponse.json({ received: true });
	} catch (error) {
		console.error('Webhook error:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		);
	}
};
