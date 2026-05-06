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
			findFirst: vi.fn(),
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

	it('should accept and construct event for a valid request', async () => {
		mockStripe.webhooks.constructEvent.mockReturnValue({
			type: 'payment_intent.succeeded',
			data: { object: { id: 'pi_123', status: 'succeeded', metadata: { bookingId: '1' } } },
		});

		const req = createMockRequest({
			method: 'POST',
			headers: { 'stripe-signature': 'valid' },
			body: { id: 'evt_valid' },
		});

		const response = await POST(req);

		expect(response.status).toBe(200);
		expect(mockStripe.webhooks.constructEvent).toHaveBeenCalled();
	});
});
