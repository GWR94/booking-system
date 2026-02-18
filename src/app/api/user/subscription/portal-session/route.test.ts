import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseResponse } from '@test/api-test-utils';

const mockGetSessionUser = vi.fn();
const { mockDb } = vi.hoisted(() => ({
	mockDb: {
		user: { findUnique: vi.fn() },
	},
}));

const mockBillingPortalCreate = vi.fn();

vi.mock('src/server/auth/auth', () => ({
	getSessionUser: (...args: unknown[]) => mockGetSessionUser(...args),
}));

vi.mock('@db', () => ({
	db: mockDb,
}));

vi.mock('stripe', () => ({
	default: vi.fn().mockImplementation(() => ({
		billingPortal: {
			sessions: {
				create: (...args: unknown[]) => mockBillingPortalCreate(...args),
			},
		},
	})),
}));

import { POST } from './route';

describe('POST /api/user/subscription/portal-session', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockBillingPortalCreate.mockResolvedValue({ url: 'https://billing.stripe.com/session/xyz' });
	});

	it('should return 401 when not authenticated', async () => {
		mockGetSessionUser.mockResolvedValue(null);

		const response = await POST({} as any);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(401);
		expect(body.error).toBe('Unauthorized');
		expect(mockDb.user.findUnique).not.toHaveBeenCalled();
	});

	it('should return 400 when user has no stripeCustomerId', async () => {
		mockGetSessionUser.mockResolvedValue({ id: 1 });
		mockDb.user.findUnique.mockResolvedValue({
			id: 1,
			email: 'u@example.com',
			stripeCustomerId: null,
		});

		const response = await POST({} as any);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(400);
		expect(body.error).toBe('User has no subscription to manage');
		expect(mockBillingPortalCreate).not.toHaveBeenCalled();
	});

	it('should return 400 when user not found', async () => {
		mockGetSessionUser.mockResolvedValue({ id: 999 });
		mockDb.user.findUnique.mockResolvedValue(null);

		const response = await POST({} as any);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(400);
		expect(body.error).toBe('User has no subscription to manage');
	});

	it('should return portal URL on success', async () => {
		mockGetSessionUser.mockResolvedValue({ id: 1 });
		mockDb.user.findUnique.mockResolvedValue({
			id: 1,
			stripeCustomerId: 'cus_abc123',
		});

		const response = await POST({} as any);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(200);
		expect(body.url).toBe('https://billing.stripe.com/session/xyz');
		expect(mockBillingPortalCreate).toHaveBeenCalledWith({
			customer: 'cus_abc123',
			return_url: expect.stringContaining('/profile'),
		});
	});

	it('should return 500 on Stripe error', async () => {
		mockGetSessionUser.mockResolvedValue({ id: 1 });
		mockDb.user.findUnique.mockResolvedValue({
			id: 1,
			stripeCustomerId: 'cus_abc123',
		});
		mockBillingPortalCreate.mockRejectedValue(new Error('Stripe API error'));

		const response = await POST({} as any);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(500);
		expect(body.error).toBe('Stripe API error');
	});
});
