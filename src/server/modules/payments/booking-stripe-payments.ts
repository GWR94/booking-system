import { createHash } from 'crypto';
import Stripe from 'stripe';
import { makeStripeWebhookRouter } from './stripe-webhook-router';

type Logger = Pick<Console, 'error' | 'warn' | 'info'>;

export type GuestInfo = { name: string; email: string; phone?: string };

export type CreatePaymentIntentInput = {
	amount: number; // minor units (pence)
	currency: string;
	slotIds: number[];
	sessionUserId?: number | null;
	guestInfo?: GuestInfo | null;
};

export type CreatePaymentIntentResult = {
	clientSecret: string | null;
};

export type BookingStripePaymentsDeps = {
	stripe: Stripe;
	db: {
		booking: {
			findUnique: (args: any) => Promise<any>;
			findFirst: (args: any) => Promise<any>;
		};
	};
	bookingService: {
		confirmBooking: (
			bookingId: number,
			paymentId: string,
			paymentStatus: string,
		) => Promise<unknown>;
		createBooking: (args: any) => Promise<{ id: number }>;
		handleFailedPayment: (bookingId: number) => Promise<unknown>;
	};
	bookingLifecycle?: {
		handlePaymentIntentSucceeded: (args: {
			paymentIntentId: string;
			paymentStatus: string;
			metadata: Record<string, unknown>;
		}) => Promise<void>;
		handlePaymentIntentFailed: (args: {
			paymentIntentId: string;
			paymentStatus: string;
			metadata: Record<string, unknown>;
		}) => Promise<void>;
		handlePaymentIntentCreated: (args: {
			paymentIntentId: string;
			paymentStatus: string;
			metadata: Record<string, unknown>;
		}) => Promise<void>;
	};
	membershipService: {
		handleMembershipUpdate: (
			subscription: Stripe.Subscription,
		) => Promise<unknown>;
	};
	logger?: Logger;
};

function idempotencyHash(ids: number[], email?: string | null): string {
	const sorted = [...ids].sort((a, b) => a - b);
	return createHash('sha256')
		.update((email?.trim() ?? '') + JSON.stringify(sorted))
		.digest('hex')
		.slice(0, 32);
}

export type BookingStripePayments = {
	createPaymentIntent: (
		input: CreatePaymentIntentInput,
	) => Promise<CreatePaymentIntentResult>;
	handleWebhook: (args: {
		rawBody: string;
		signature: string;
		webhookSecret: string;
		schedule: (fn: () => void | Promise<void>) => void;
	}) => Promise<{ ok: true } | { ok: false; status: 400; error: string }>;
};

export function makeBookingStripePayments(
	deps: BookingStripePaymentsDeps,
): BookingStripePayments {
	const router = makeStripeWebhookRouter(deps);
	const log: Logger = deps.logger ?? console;

	return {
		async createPaymentIntent(input) {
			const effectiveGuestInfo = input.guestInfo ?? null;
			const sessionUserId = input.sessionUserId ?? null;

			const metadata: Record<string, string> = {
				slotIds: JSON.stringify(input.slotIds),
				isGuest: effectiveGuestInfo ? 'true' : 'false',
			};

			if (!effectiveGuestInfo && sessionUserId != null) {
				metadata.userId = sessionUserId.toString();
			}
			if (effectiveGuestInfo) {
				metadata.guestName = effectiveGuestInfo.name;
				metadata.guestEmail = effectiveGuestInfo.email;
				metadata.guestPhone = effectiveGuestInfo.phone ?? '';
			}

			const slotHash = idempotencyHash(input.slotIds);
			const guestHash = idempotencyHash(
				input.slotIds,
				effectiveGuestInfo?.email,
			);
			const idempotencyKey =
				sessionUserId != null
					? `pi-${sessionUserId}-${slotHash}`
					: `pi-guest-${guestHash}`;

			const intent = await deps.stripe.paymentIntents.create(
				{
					amount: input.amount,
					currency: input.currency,
					metadata,
				},
				{ idempotencyKey },
			);

			return { clientSecret: intent.client_secret };
		},

		async handleWebhook({ rawBody, signature, webhookSecret, schedule }) {
			let event: Stripe.Event;
			try {
				event = deps.stripe.webhooks.constructEvent(
					rawBody,
					signature,
					webhookSecret,
				);
			} catch (err: unknown) {
				log.error(
					`⚠️  Webhook signature verification failed. ${err instanceof Error ? err.message : String(err)}`,
				);
				return {
					ok: false,
					status: 400,
					error: 'Webhook signature verification failed',
				};
			}

			schedule(() =>
				router.routeEvent(event).catch((err) => {
					log.error('Webhook processing error:', err);
				}),
			);

			return { ok: true };
		},
	};
}
