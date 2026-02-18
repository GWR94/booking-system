import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockRequest, parseResponse } from '@test/api-test-utils';

const mockGetSessionUser = vi.fn();
const { mockDb } = vi.hoisted(() => ({
	mockDb: {
		user: { findUnique: vi.fn(), update: vi.fn() },
	},
}));

const mockCustomersCreate = vi.fn();
const mockCustomersUpdate = vi.fn();
const mockCheckoutSessionsCreate = vi.fn();

vi.mock('src/server/auth/auth', () => ({
	getSessionUser: (...args: unknown[]) => mockGetSessionUser(...args),
}));

vi.mock('@db', () => ({
	db: mockDb,
}));

vi.mock('stripe', () => ({
	default: vi.fn().mockImplementation(() => ({
		customers: {
			create: (...args: unknown[]) => mockCustomersCreate(...args),
			update: (...args: unknown[]) => mockCustomersUpdate(...args),
		},
		checkout: {
			sessions: {
				create: (...args: unknown[]) => mockCheckoutSessionsCreate(...args),
			},
		},
	})),
}));

import { POST } from './route';

describe('POST /api/user/subscription/create-session', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockCustomersCreate.mockResolvedValue({ id: 'cus_new123' });
		mockCheckoutSessionsCreate.mockResolvedValue({
			id: 'cs_123',
			url: 'https://checkout.stripe.com/session/xyz',
		});
	});

	it('should return 401 when not authenticated', async () => {
		mockGetSessionUser.mockResolvedValue(null);
		const req = createMockRequest({ method: 'POST', body: { tier: 'PAR' } });

		const response = await POST(req);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(401);
		expect(body.error).toBe('Unauthorized');
		expect(mockDb.user.findUnique).not.toHaveBeenCalled();
	});

	it('should return 400 for invalid tier', async () => {
		mockGetSessionUser.mockResolvedValue({ id: 1 });
		const req = createMockRequest({
			method: 'POST',
			body: { tier: 'INVALID' },
		});

		const response = await POST(req);
		const { status } = await parseResponse(response);

		expect(status).toBe(400);
		expect(mockDb.user.findUnique).not.toHaveBeenCalled();
	});

	it('should return 404 when user not found', async () => {
		mockGetSessionUser.mockResolvedValue({ id: 999 });
		mockDb.user.findUnique.mockResolvedValue(null);
		const req = createMockRequest({ method: 'POST', body: { tier: 'PAR' } });

		const response = await POST(req);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(404);
		expect(body.error).toBe('User not found');
	});

	it('should create checkout session and return url when user has no Stripe customer', async () => {
		mockGetSessionUser.mockResolvedValue({ id: 1 });
		mockDb.user.findUnique.mockResolvedValue({
			id: 1,
			email: 'user@example.com',
			name: 'User',
			stripeCustomerId: null,
		});
		mockDb.user.update.mockResolvedValue({});

		const req = createMockRequest({ method: 'POST', body: { tier: 'PAR' } });
		const response = await POST(req);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(200);
		expect(body.url).toBe('https://checkout.stripe.com/session/xyz');
		expect(body.sessionId).toBe('cs_123');
		expect(mockCustomersCreate).toHaveBeenCalledWith({
			email: 'user@example.com',
			name: 'User',
			metadata: { userId: '1' },
		});
		expect(mockDb.user.update).toHaveBeenCalledWith({
			where: { id: 1 },
			data: { stripeCustomerId: 'cus_new123' },
		});
		expect(mockCheckoutSessionsCreate).toHaveBeenCalledWith(
			expect.objectContaining({
				customer: 'cus_new123',
				mode: 'subscription',
				payment_method_types: ['card'],
				metadata: { userId: '1', tier: 'PAR' },
			}),
		);
		expect(mockCheckoutSessionsCreate.mock.calls[0][0].line_items).toHaveLength(1);
		expect(mockCheckoutSessionsCreate.mock.calls[0][0].line_items[0]).toMatchObject({
			quantity: 1,
		});
	});

	it('should return session url when user already has stripeCustomerId', async () => {
		mockGetSessionUser.mockResolvedValue({ id: 1 });
		mockDb.user.findUnique.mockResolvedValue({
			id: 1,
			email: 'user@example.com',
			name: 'User',
			stripeCustomerId: 'cus_existing',
		});

		const req = createMockRequest({ method: 'POST', body: { tier: 'BIRDIE' } });
		const response = await POST(req);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(200);
		expect(body.url).toBe('https://checkout.stripe.com/session/xyz');
		expect(mockCustomersCreate).not.toHaveBeenCalled();
		expect(mockCheckoutSessionsCreate).toHaveBeenCalledWith(
			expect.objectContaining({
				customer: 'cus_existing',
				metadata: { userId: '1', tier: 'BIRDIE' },
			}),
		);
	});

	it('should return 500 on Stripe error', async () => {
		mockGetSessionUser.mockResolvedValue({ id: 1 });
		mockDb.user.findUnique.mockResolvedValue({
			id: 1,
			email: 'u@example.com',
			name: 'U',
			stripeCustomerId: null,
		});
		mockCustomersCreate.mockRejectedValue(new Error('Stripe failed'));

		const req = createMockRequest({ method: 'POST', body: { tier: 'PAR' } });
		const response = await POST(req);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(500);
		expect(body.error).toBe('Stripe failed');
	});
});
