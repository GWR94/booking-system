import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockStripe } = vi.hoisted(() => ({
	mockStripe: {
		webhooks: {
			constructEvent: vi.fn(),
		},
		paymentIntents: {
			update: vi.fn(),
		},
	},
}));

const { mockBookingService } = vi.hoisted(() => ({
	mockBookingService: {
		confirmBooking: vi.fn(),
		createBooking: vi.fn(),
		handleFailedPayment: vi.fn(),
	},
}));

const { mockMembershipService } = vi.hoisted(() => ({
	mockMembershipService: {
		handleMembershipUpdate: vi.fn(),
	},
}));

const { mockDb } = vi.hoisted(() => ({
	mockDb: {
		booking: {
			findUnique: vi.fn(),
		},
	},
}));

vi.mock('@lib/stripe', () => ({
	getStripe: vi.fn(() => mockStripe),
}));

vi.mock('@modules', () => ({
	BookingService: mockBookingService,
	MembershipService: mockMembershipService,
}));

vi.mock('@db', () => ({
	db: mockDb,
}));

import { POST } from './route';
import { createMockRequest } from '@test/api-test-utils';

describe('POST /api/webhook', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test';
	});

	it('should return 400 if signature verification fails', async () => {
		mockStripe.webhooks.constructEvent.mockImplementation(() => {
			throw new Error('Signature verification failed');
		});

		const req = createMockRequest({
			method: 'POST',
			headers: { 'stripe-signature': 'invalid' },
			body: { id: 'evt_123' },
		});

		const response = await POST(req);

		expect(response.status).toBe(400);
		const data = await response.json();
		expect(data.error).toBe('Webhook signature verification failed');
	});

	it('should process payment_intent.succeeded', async () => {
		mockDb.booking.findUnique.mockResolvedValue({ status: 'pending' });

		const mockEvent = {
			type: 'payment_intent.succeeded',
			data: {
				object: {
					id: 'pi_123',
					status: 'succeeded',
					metadata: { bookingId: '1' },
				},
			},
		};

		mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);

		const req = createMockRequest({
			method: 'POST',
			headers: { 'stripe-signature': 'valid' },
		});

		const response = await POST(req);

		expect(response.status).toBe(200);
		expect(mockBookingService.confirmBooking).toHaveBeenCalledWith(
			1,
			'pi_123',
			'succeeded',
		);
	});

	it('should skip payment_intent.succeeded when booking already confirmed', async () => {
		mockDb.booking.findUnique.mockResolvedValue({ status: 'confirmed' });

		const mockEvent = {
			type: 'payment_intent.succeeded',
			data: {
				object: {
					id: 'pi_123',
					status: 'succeeded',
					metadata: { bookingId: '1' },
				},
			},
		};

		mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);

		const req = createMockRequest({
			method: 'POST',
			headers: { 'stripe-signature': 'valid' },
		});

		const response = await POST(req);

		expect(response.status).toBe(200);
		expect(mockBookingService.confirmBooking).not.toHaveBeenCalled();
	});

	it('should process payment_intent.created for user', async () => {
		const mockEvent = {
			type: 'payment_intent.created',
			data: {
				object: {
					id: 'pi_new',
					status: 'requires_payment_method',
					metadata: {
						userId: '10',
						slotIds: '[501, 502]',
						isGuest: 'false',
					},
				},
			},
		};

		mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);
		mockBookingService.createBooking.mockResolvedValue({ id: 100 });

		const req = createMockRequest({
			method: 'POST',
			headers: { 'stripe-signature': 'valid' },
		});

		const response = await POST(req);

		expect(response.status).toBe(200);
		expect(mockBookingService.createBooking).toHaveBeenCalledWith({
			userId: 10,
			slotIds: [501, 502],
			paymentId: 'pi_new',
			paymentStatus: 'requires_payment_method',
		});
		expect(mockStripe.paymentIntents.update).toHaveBeenCalledWith('pi_new', {
			metadata: expect.objectContaining({ bookingId: '100' }),
		});
	});

	it('should process customer.subscription.updated', async () => {
		const mockEvent = {
			type: 'customer.subscription.updated',
			data: {
				object: { id: 'sub_123' },
			},
		};

		mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);

		const req = createMockRequest({
			method: 'POST',
			headers: { 'stripe-signature': 'valid' },
		});

		const response = await POST(req);

		expect(response.status).toBe(200);
		expect(mockMembershipService.handleMembershipUpdate).toHaveBeenCalled();
	});
});
