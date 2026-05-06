export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { after } from 'next/server';
import { db } from '@db';
import { BookingService } from '@modules';
import { MembershipService } from '@modules';
import { getStripe } from '@lib/stripe';
import { makeBookingStripePayments } from '@/server/modules/payments/booking-stripe-payments';
import { makeBookingLifecycle } from '@/server/modules/booking-lifecycle/booking/booking-lifecycle';
import { parseWithFirstError } from '@lib/zod';
import {
	apiStripeWebhookHeaderSchema,
	apiStripeWebhookPayloadSchema,
} from '@validation/api-schemas';

export const POST = async (req: NextRequest) => {
	const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
	try {
		const parsedHeaders = parseWithFirstError(apiStripeWebhookHeaderSchema, {
			signature: req.headers.get('stripe-signature') ?? undefined,
		});

		if (!parsedHeaders.success) {
			return NextResponse.json({ error: parsedHeaders.message }, { status: 400 });
		}

		const { signature } = parsedHeaders.data;

		if (!endpointSecret) {
			return NextResponse.json(
				{ error: 'Missing signature or secret' },
				{ status: 400 },
			);
		}

		const rawBodyInput = await req.text();
		const parsedPayload = parseWithFirstError(
			apiStripeWebhookPayloadSchema,
			rawBodyInput,
		);

		if (!parsedPayload.success) {
			return NextResponse.json({ error: parsedPayload.message }, { status: 400 });
		}

		const rawBody = parsedPayload.data;

		const stripe = getStripe();
		const lifecycle = makeBookingLifecycle({
			db,
			bookingService: BookingService,
			stripe,
		});

		const payments = makeBookingStripePayments({
			stripe,
			db,
			bookingService: BookingService,
			bookingLifecycle: lifecycle,
			membershipService: MembershipService,
		});

		const verified = await payments.handleWebhook({
			rawBody,
			signature,
			webhookSecret: endpointSecret,
			schedule: after,
		});

		if (!verified.ok) {
			return NextResponse.json({ error: verified.error }, { status: verified.status });
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
