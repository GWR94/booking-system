import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeBookingLifecycle } from './booking-lifecycle';

describe('booking-lifecycle', () => {
	const db = {
		booking: {
			findUnique: vi.fn(),
			findFirst: vi.fn(),
			findMany: vi.fn(),
			update: vi.fn(),
		},
		slot: {
			updateMany: vi.fn(),
		},
	} as any;

	const stripe = {
		refunds: { create: vi.fn() },
		paymentIntents: { update: vi.fn() },
	} as any;

	const sendRefundFailedAlert = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('cancelBooking refunds when >=24h and releases slots', async () => {
		const booking = {
			id: 1,
			userId: 1,
			paymentId: 'pi_123',
			slots: [{ id: 10, startTime: new Date(Date.now() + 48 * 3600000) }],
			user: { email: 'u@example.com', name: 'U' },
		};
		db.booking.findUnique.mockResolvedValue(booking);
		db.slot.updateMany.mockResolvedValue({ count: 1 });
		db.booking.update.mockResolvedValue({});

		const lifecycle = makeBookingLifecycle({
			db,
			stripe,
			sendRefundFailedAlert,
		});

		const res = await lifecycle.cancelBooking({
			bookingId: 1,
			actor: { userId: 1, role: 'user' },
		});

		expect(res.ok).toBe(true);
		if (res.ok) {
			expect(res.result.refundStatus).toBe('refunded');
		}
		expect(stripe.refunds.create).toHaveBeenCalledWith(
			{ payment_intent: 'pi_123' },
			{ idempotencyKey: 'refund-booking-1' },
		);
		expect(db.slot.updateMany).toHaveBeenCalled();
		expect(db.booking.update).toHaveBeenCalledWith(
			expect.objectContaining({ data: expect.objectContaining({ status: 'cancelled' }) }),
		);
	});

	it('cancelBooking does not refund when <24h', async () => {
		const booking = {
			id: 1,
			userId: 1,
			paymentId: 'pi_123',
			slots: [{ id: 10, startTime: new Date(Date.now() + 2 * 3600000) }],
			user: { email: 'u@example.com', name: 'U' },
		};
		db.booking.findUnique.mockResolvedValue(booking);
		db.booking.update.mockResolvedValue({});

		const lifecycle = makeBookingLifecycle({
			db,
			stripe,
			sendRefundFailedAlert,
		});

		const res = await lifecycle.cancelBooking({
			bookingId: 1,
			actor: { userId: 1, role: 'user' },
		});

		expect(res.ok).toBe(true);
		if (res.ok) {
			expect(res.result.refundStatus).toBe('not_refunded_policy');
		}
		expect(stripe.refunds.create).not.toHaveBeenCalled();
	});

	it('cleanupStalePendingBookings cancels and releases slots', async () => {
		db.booking.findMany.mockResolvedValue([
			{ id: 1, slots: [{ id: 10 }, { id: 11 }] },
			{ id: 2, slots: [{ id: 20 }] },
		]);

		const lifecycle = makeBookingLifecycle({ db });
		const res = await lifecycle.cleanupStalePendingBookings({ olderThanMinutes: 15 });

		expect(res.ok).toBe(true);
		if (res.ok) {
			expect(res.result.cleaned).toBe(2);
		}
		expect(db.booking.update).toHaveBeenCalledTimes(2);
		expect(db.slot.updateMany).toHaveBeenCalledTimes(2);
	});

	it('confirmPaid delegates to bookingService when not confirmed', async () => {
		db.booking.findUnique.mockResolvedValue({ status: 'pending' });
		const bookingService = {
			confirmBooking: vi.fn(),
			handleFailedPayment: vi.fn(),
		};
		const lifecycle = makeBookingLifecycle({ db, bookingService } as any);

		await lifecycle.confirmPaid({
			bookingId: 1,
			paymentId: 'pi_123',
			paymentStatus: 'succeeded',
		});

		expect(bookingService.confirmBooking).toHaveBeenCalledWith(
			1,
			'pi_123',
			'succeeded',
		);
	});

	it('createPendingBooking delegates to bookingService.createBooking', async () => {
		const bookingService = {
			createBooking: vi.fn().mockResolvedValue({ id: 123 }),
			confirmBooking: vi.fn(),
			handleFailedPayment: vi.fn(),
		};

		const lifecycle = makeBookingLifecycle({ db, bookingService } as any);

		const res = await lifecycle.createPendingBooking({
			slotIds: [10, 11],
			paymentId: 'pi_1',
			paymentStatus: 'succeeded',
			userId: 1,
		});

		expect(res.ok).toBe(true);
		if (res.ok) {
			expect(res.booking).toEqual({ id: 123 });
		}
		expect(bookingService.createBooking).toHaveBeenCalledWith({
			userId: 1,
			slotIds: [10, 11],
			paymentId: 'pi_1',
			paymentStatus: 'succeeded',
			guestInfo: undefined,
		});
	});

	it('markPaymentFailed delegates to bookingService when not failed', async () => {
		db.booking.findUnique.mockResolvedValue({ status: 'pending' });
		const bookingService = {
			confirmBooking: vi.fn(),
			handleFailedPayment: vi.fn(),
		};
		const lifecycle = makeBookingLifecycle({ db, bookingService } as any);

		await lifecycle.markPaymentFailed({ bookingId: 1 });

		expect(bookingService.handleFailedPayment).toHaveBeenCalledWith(1);
	});

	it('handlePaymentIntentCreated creates booking for guest and backfills bookingId into Stripe metadata', async () => {
		db.booking.findFirst.mockResolvedValue(null);
		db.booking.findUnique.mockResolvedValue(null);

		const bookingService = {
			createBooking: vi.fn().mockResolvedValue({ id: 100 }),
			confirmBooking: vi.fn(),
			handleFailedPayment: vi.fn(),
		};

		const lifecycle = makeBookingLifecycle({
			db,
			stripe,
			bookingService,
		} as any);

		await lifecycle.handlePaymentIntentCreated({
			paymentIntentId: 'pi_new',
			paymentStatus: 'requires_payment_method',
			metadata: {
				slotIds: '[1,2]',
				isGuest: 'true',
				guestName: 'Guest User',
				guestEmail: 'guest@example.com',
				guestPhone: '07700900000',
			},
		});

		expect(bookingService.createBooking).toHaveBeenCalledWith({
			slotIds: [1, 2],
			paymentId: 'pi_new',
			paymentStatus: 'requires_payment_method',
			guestInfo: {
				name: 'Guest User',
				email: 'guest@example.com',
				phone: '07700900000',
			},
		});
		expect(stripe.paymentIntents.update).toHaveBeenCalledWith('pi_new', {
			metadata: expect.objectContaining({ bookingId: '100' }),
		});
	});

	it('handlePaymentIntentCreated backfills bookingId into Stripe when booking already exists by paymentId', async () => {
		db.booking.findFirst.mockResolvedValue({ id: 42 });

		const bookingService = {
			createBooking: vi.fn(),
			confirmBooking: vi.fn(),
			handleFailedPayment: vi.fn(),
		};

		const lifecycle = makeBookingLifecycle({
			db,
			stripe,
			bookingService,
		} as any);

		await lifecycle.handlePaymentIntentCreated({
			paymentIntentId: 'pi_existing',
			paymentStatus: 'requires_payment_method',
			metadata: {
				slotIds: '[1]',
				isGuest: 'false',
				userId: '10',
			},
		});

		expect(bookingService.createBooking).not.toHaveBeenCalled();
		expect(stripe.paymentIntents.update).toHaveBeenCalledWith('pi_existing', {
			metadata: expect.objectContaining({ bookingId: '42' }),
		});
	});

	it('handlePaymentIntentCreated returns early when metadata already contains bookingId', async () => {
		db.booking.findFirst.mockResolvedValue(null);

		const bookingService = {
			createBooking: vi.fn(),
			confirmBooking: vi.fn(),
			handleFailedPayment: vi.fn(),
		};

		const lifecycle = makeBookingLifecycle({
			db,
			stripe,
			bookingService,
		} as any);

		await lifecycle.handlePaymentIntentCreated({
			paymentIntentId: 'pi_skip',
			paymentStatus: 'requires_payment_method',
			metadata: {
				bookingId: '999',
				slotIds: '[1]',
				isGuest: 'false',
				userId: '10',
			},
		});

		expect(bookingService.createBooking).not.toHaveBeenCalled();
		expect(stripe.paymentIntents.update).not.toHaveBeenCalled();
	});

	it('handlePaymentIntentSucceeded creates booking when metadata.bookingId is missing and confirms when not confirmed', async () => {
		const bookingService = {
			createBooking: vi.fn().mockResolvedValue({ id: 100 }),
			confirmBooking: vi.fn(),
			handleFailedPayment: vi.fn(),
		};

		db.booking.findFirst
			.mockResolvedValueOnce(null) // existingBooking check inside handlePaymentIntentCreated
			.mockResolvedValueOnce({ id: 100, status: 'pending' }); // booking lookup by paymentId in succeeded handler

		const lifecycle = makeBookingLifecycle({
			db,
			stripe,
			bookingService,
		} as any);

		await lifecycle.handlePaymentIntentSucceeded({
			paymentIntentId: 'pi_new',
			paymentStatus: 'succeeded',
			metadata: {
				slotIds: '[1,2]',
				isGuest: 'false',
				userId: '10',
			},
		});

		expect(bookingService.createBooking).toHaveBeenCalledWith({
			userId: 10,
			slotIds: [1, 2],
			paymentId: 'pi_new',
			paymentStatus: 'succeeded',
		});
		expect(stripe.paymentIntents.update).toHaveBeenCalledWith('pi_new', {
			metadata: expect.objectContaining({ bookingId: '100' }),
		});
		expect(bookingService.confirmBooking).toHaveBeenCalledWith(
			100,
			'pi_new',
			'succeeded',
		);
	});

	it('handlePaymentIntentSucceeded is idempotent when booking already exists by paymentId', async () => {
		const bookingService = {
			createBooking: vi.fn(),
			confirmBooking: vi.fn(),
			handleFailedPayment: vi.fn(),
		};

		db.booking.findFirst.mockResolvedValue({ id: 42, status: 'pending' });

		const lifecycle = makeBookingLifecycle({
			db,
			stripe,
			bookingService,
		} as any);

		await lifecycle.handlePaymentIntentSucceeded({
			paymentIntentId: 'pi_existing',
			paymentStatus: 'succeeded',
			metadata: {
				slotIds: '[1]',
				isGuest: 'false',
				userId: '10',
			},
		});

		expect(bookingService.createBooking).not.toHaveBeenCalled();
		expect(stripe.paymentIntents.update).toHaveBeenCalledWith('pi_existing', {
			metadata: expect.objectContaining({ bookingId: '42' }),
		});
		expect(bookingService.confirmBooking).toHaveBeenCalledWith(
			42,
			'pi_existing',
			'succeeded',
		);
	});

	it('handlePaymentIntentFailed creates booking when metadata.bookingId is missing and releases slots via handleFailedPayment', async () => {
		const bookingService = {
			createBooking: vi.fn().mockResolvedValue({ id: 200 }),
			confirmBooking: vi.fn(),
			handleFailedPayment: vi.fn(),
		};

		db.booking.findFirst
			.mockResolvedValueOnce(null) // existingBooking check inside handlePaymentIntentCreated
			.mockResolvedValueOnce({ id: 200, status: 'pending' }); // booking lookup by paymentId in failed handler

		const lifecycle = makeBookingLifecycle({
			db,
			stripe,
			bookingService,
		} as any);

		await lifecycle.handlePaymentIntentFailed({
			paymentIntentId: 'pi_fail',
			paymentStatus: 'requires_payment_method',
			metadata: {
				slotIds: '[1]',
				isGuest: 'false',
				userId: '10',
			},
		});

		expect(bookingService.createBooking).toHaveBeenCalled();
		expect(bookingService.handleFailedPayment).toHaveBeenCalledWith(200);
		expect(stripe.paymentIntents.update).toHaveBeenCalledWith('pi_fail', {
			metadata: expect.objectContaining({ bookingId: '200' }),
		});
	});
});

