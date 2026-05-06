import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMockRequest, parseResponse } from '@test/api-test-utils';

const mockRetrieve = vi.fn();
const mockFindUnique = vi.fn();
const mockRequireSession = vi.fn();

vi.mock('../../../_utils/auth', () => ({
	requireSession: (...args: unknown[]) => mockRequireSession(...args),
}));

vi.mock('@lib/stripe', () => ({
	getStripe: () => ({
		paymentIntents: {
			retrieve: (...args: unknown[]) => mockRetrieve(...args),
		},
	}),
}));

vi.mock('@db', () => ({
	db: {
		booking: {
			findUnique: (...args: unknown[]) => mockFindUnique(...args),
		},
	},
}));

import { POST } from './route';

describe('POST /api/bookings/[id]/resume-payment', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockRequireSession.mockResolvedValue({ ok: true, user: { id: 10, role: 'user' } });
	});

	it('returns 401 for unauthenticated user', async () => {
		mockRequireSession.mockResolvedValue({
			ok: false,
			response: new Response(JSON.stringify({ code: 'AUTH_REQUIRED' }), {
				status: 401,
				headers: { 'content-type': 'application/json' },
			}),
		});
		const res = await POST(createMockRequest({ method: 'POST' }), {
			params: Promise.resolve({ id: '1' }),
		});
		const { status, body } = await parseResponse(res);
		expect(status).toBe(401);
		expect(body.code).toBe('AUTH_REQUIRED');
	});

	it('returns client secret for resumable pending booking', async () => {
		mockFindUnique.mockResolvedValue({
			id: 1,
			userId: 10,
			status: 'pending',
			paymentId: 'pi_123',
			slots: [{ id: 100, endTime: new Date(Date.now() + 60 * 60 * 1000) }],
		});
		mockRetrieve.mockResolvedValue({
			id: 'pi_123',
			status: 'requires_payment_method',
			client_secret: 'pi_123_secret_abc',
		});

		const res = await POST(createMockRequest({ method: 'POST' }), {
			params: Promise.resolve({ id: '1' }),
		});
		const { status, body } = await parseResponse(res);
		expect(status).toBe(200);
		expect(body.clientSecret).toBe('pi_123_secret_abc');
	});

	it('returns 403 when booking is not owned by session user', async () => {
		mockFindUnique.mockResolvedValue({
			id: 1,
			userId: 77,
			status: 'pending',
			paymentId: 'pi_123',
			slots: [],
		});

		const res = await POST(createMockRequest({ method: 'POST' }), {
			params: Promise.resolve({ id: '1' }),
		});
		const { status, body } = await parseResponse(res);
		expect(status).toBe(403);
		expect(body.code).toBe('FORBIDDEN');
	});
});

