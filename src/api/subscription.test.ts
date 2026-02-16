import { describe, it, expect, vi, beforeEach } from 'vitest';
import { axios } from '@api/client';
import { createSubscriptionSession, createPortalSession } from './subscription';

vi.mock('@api/client', () => ({
	axios: {
		post: vi.fn(),
	},
}));

describe('subscription api', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('createSubscriptionSession should call POST /api/user/subscription/create-session', async () => {
		const tier = 'GOLD';
		const mockResponse = { sessionId: 'sess_123' };
		(axios.post as any).mockResolvedValue({ data: mockResponse });

		const result = await createSubscriptionSession(tier);

		expect(axios.post).toHaveBeenCalledWith(
			'/api/user/subscription/create-session',
			{ tier },
		);
		expect(result).toEqual(mockResponse);
	});

	it('createPortalSession should call POST /api/user/subscription/portal-session', async () => {
		const mockResponse = { url: 'https://stripe.com/portal' };
		(axios.post as any).mockResolvedValue({ data: mockResponse });

		const result = await createPortalSession();

		expect(axios.post).toHaveBeenCalledWith(
			'/api/user/subscription/portal-session',
		);
		expect(result).toEqual(mockResponse);
	});
});
