import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeBookingStripePayments } from './booking-stripe-payments';

describe('booking-stripe-payments', () => {
	const stripe = {
		paymentIntents: {
			create: vi.fn(),
			update: vi.fn(),
		},
		webhooks: {
			constructEvent: vi.fn(),
		},
	} as any;

	const db = {
		booking: {
			findUnique: vi.fn(),
			findFirst: vi.fn(),
		},
	} as any;

	const bookingService = {
		confirmBooking: vi.fn(),
		createBooking: vi.fn(),
		handleFailedPayment: vi.fn(),
	};

	const bookingLifecycle = {
		handlePaymentIntentSucceeded: vi.fn(),
		handlePaymentIntentFailed: vi.fn(),
		handlePaymentIntentCreated: vi.fn(),
	};

	const membershipService = {
		handleMembershipUpdate: vi.fn(),
	};

	const scheduleFns: Array<() => void | Promise<void>> = [];
	const schedule = (fn: () => void | Promise<void>) => scheduleFns.push(fn);

	beforeEach(() => {
		vi.clearAllMocks();
		scheduleFns.length = 0;
		stripe.paymentIntents.create.mockResolvedValue({ client_secret: 'pi_secret_xyz' });
	});

	it('createPaymentIntent sets metadata and idempotency key (user)', async () => {
		const payments = makeBookingStripePayments({
			stripe,
			db,
			bookingService,
			bookingLifecycle,
			membershipService,
		});

		await payments.createPaymentIntent({
			amount: 5000,
			currency: 'gbp',
			slotIds: [2, 1],
			sessionUserId: 123,
		});

		expect(stripe.paymentIntents.create).toHaveBeenCalledWith(
			{
				amount: 5000,
				currency: 'gbp',
				metadata: expect.objectContaining({
					slotIds: '[2,1]',
					isGuest: 'false',
					userId: '123',
				}),
			},
			{ idempotencyKey: expect.stringMatching(/^pi-123-[a-f0-9]{32}$/) },
		);
	});

	it('createPaymentIntent sets metadata and idempotency key (guest)', async () => {
		const payments = makeBookingStripePayments({
			stripe,
			db,
			bookingService,
			bookingLifecycle,
			membershipService,
		});

		await payments.createPaymentIntent({
			amount: 5000,
			currency: 'gbp',
			slotIds: [1],
			guestInfo: {
				name: 'Guest User',
				email: 'guest@example.com',
				phone: '07700900000',
			},
		});

		expect(stripe.paymentIntents.create).toHaveBeenCalledWith(
			{
				amount: 5000,
				currency: 'gbp',
				metadata: expect.objectContaining({
					slotIds: '[1]',
					isGuest: 'true',
					guestName: 'Guest User',
					guestEmail: 'guest@example.com',
					guestPhone: '07700900000',
				}),
			},
			{ idempotencyKey: expect.stringMatching(/^pi-guest-[a-f0-9]{32}$/) },
		);
	});

	it('handleWebhook returns 400 when signature verification fails', async () => {
		const payments = makeBookingStripePayments({
			stripe,
			db,
			bookingService,
			bookingLifecycle,
			membershipService,
		});

		stripe.webhooks.constructEvent.mockImplementation(() => {
			throw new Error('bad sig');
		});

		const res = await payments.handleWebhook({
			rawBody: 'raw',
			signature: 'sig',
			webhookSecret: 'whsec',
			schedule,
		});

		expect(res).toEqual({
			ok: false,
			status: 400,
			error: 'Webhook signature verification failed',
		});
		expect(scheduleFns).toHaveLength(0);
	});

	it('handleWebhook schedules processing and handles booking on payment_intent.succeeded', async () => {
		const payments = makeBookingStripePayments({
			stripe,
			db,
			bookingService,
			bookingLifecycle,
			membershipService,
		});

		db.booking.findUnique.mockResolvedValue({ status: 'pending' });
		stripe.webhooks.constructEvent.mockReturnValue({
			type: 'payment_intent.succeeded',
			data: { object: { id: 'pi_123', status: 'succeeded', metadata: { bookingId: '1' } } },
		});

		const res = await payments.handleWebhook({
			rawBody: 'raw',
			signature: 'sig',
			webhookSecret: 'whsec',
			schedule,
		});
		expect(res).toEqual({ ok: true });
		expect(scheduleFns).toHaveLength(1);

		await scheduleFns[0]();

		expect(bookingLifecycle.handlePaymentIntentSucceeded).toHaveBeenCalledWith({
			paymentIntentId: 'pi_123',
			paymentStatus: 'succeeded',
			metadata: { bookingId: '1' },
		});
	});

	it('handleWebhook passes through metadata when bookingId is missing for payment_intent.succeeded', async () => {
		const payments = makeBookingStripePayments({
			stripe,
			db,
			bookingService,
			bookingLifecycle,
			membershipService,
		});

		stripe.webhooks.constructEvent.mockReturnValue({
			type: 'payment_intent.succeeded',
			data: {
				object: {
					id: 'pi_123',
					status: 'succeeded',
					metadata: {
						slotIds: '[1]',
						isGuest: 'false',
						userId: '1',
					},
				},
			},
		});

		const res = await payments.handleWebhook({
			rawBody: 'raw',
			signature: 'sig',
			webhookSecret: 'whsec',
			schedule,
		});
		expect(res).toEqual({ ok: true });
		expect(scheduleFns).toHaveLength(1);

		await scheduleFns[0]();

		expect(bookingLifecycle.handlePaymentIntentSucceeded).toHaveBeenCalledWith({
			paymentIntentId: 'pi_123',
			paymentStatus: 'succeeded',
			metadata: {
				slotIds: '[1]',
				isGuest: 'false',
				userId: '1',
			},
		});
	});

	it('handleWebhook calls bookingLifecycle.handlePaymentIntentFailed on payment_intent.payment_failed', async () => {
		const payments = makeBookingStripePayments({
			stripe,
			db,
			bookingService,
			bookingLifecycle,
			membershipService,
		});

		stripe.webhooks.constructEvent.mockReturnValue({
			type: 'payment_intent.payment_failed',
			data: { object: { id: 'pi_999', status: 'requires_payment_method', metadata: { bookingId: '1' } } },
		});

		const res = await payments.handleWebhook({
			rawBody: 'raw',
			signature: 'sig',
			webhookSecret: 'whsec',
			schedule,
		});
		expect(res).toEqual({ ok: true });
		expect(scheduleFns).toHaveLength(1);

		await scheduleFns[0]();

		expect(bookingLifecycle.handlePaymentIntentFailed).toHaveBeenCalledWith({
			paymentIntentId: 'pi_999',
			paymentStatus: 'requires_payment_method',
			metadata: { bookingId: '1' },
		});
	});

	it('handleWebhook calls membershipService for subscription events', async () => {
		const payments = makeBookingStripePayments({
			stripe,
			db,
			bookingService,
			bookingLifecycle,
			membershipService,
		});

		stripe.webhooks.constructEvent.mockReturnValue({
			type: 'customer.subscription.created',
			data: { object: { id: 'sub_123' } },
		});

		const res = await payments.handleWebhook({
			rawBody: 'raw',
			signature: 'sig',
			webhookSecret: 'whsec',
			schedule,
		});
		expect(res).toEqual({ ok: true });
		expect(scheduleFns).toHaveLength(1);

		await scheduleFns[0]();

		expect(membershipService.handleMembershipUpdate).toHaveBeenCalledWith({
			id: 'sub_123',
		});
	});
});

