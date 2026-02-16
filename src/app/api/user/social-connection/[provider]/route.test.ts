import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockRequest, createMockParams, parseResponse } from '@test/api-test-utils';

const mockGetSessionUser = vi.fn();

vi.mock('src/server/auth/auth', () => ({
	getSessionUser: (...args: any[]) => mockGetSessionUser(...args),
}));

vi.mock('@db', () => ({
	db: {
		user: {
			findUnique: vi.fn(),
			update: vi.fn(),
		},
	},
}));

import { DELETE } from './route';
import { db } from '@db';

describe('DELETE /api/user/social-connection/[provider]', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should unlink Google provider', async () => {
		mockGetSessionUser.mockResolvedValue({ id: 1 });
		(db.user.findUnique as any).mockResolvedValue({
			id: 1,
			googleId: 'google-123',
			facebookId: null,
			twitterId: null,
			passwordHash: 'hashed',
		});
		(db.user.update as any).mockResolvedValue({
			id: 1,
			name: 'Test',
			email: 'test@example.com',
			googleId: null,
			facebookId: null,
			twitterId: null,
		});

		const req = createMockRequest({ method: 'DELETE' });
		const params = createMockParams({ provider: 'google' });
		const response = await DELETE(req, params);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(200);
		expect(body.message).toBe('google disconnected successfully');
		expect(db.user.update).toHaveBeenCalledWith({
			where: { id: 1 },
			data: { googleId: null },
			select: expect.objectContaining({ id: true, googleId: true }),
		});
	});

	it('should prevent lockout when no password and only one provider', async () => {
		mockGetSessionUser.mockResolvedValue({ id: 1 });
		(db.user.findUnique as any).mockResolvedValue({
			id: 1,
			googleId: 'google-123',
			facebookId: null,
			twitterId: null,
			passwordHash: null, // No password set
		});

		const req = createMockRequest({ method: 'DELETE' });
		const params = createMockParams({ provider: 'google' });
		const response = await DELETE(req, params);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(400);
		expect(body.error).toContain('Cannot disconnect your only login method');
	});

	it('should return 401 when not authenticated', async () => {
		mockGetSessionUser.mockResolvedValue(null);

		const req = createMockRequest({ method: 'DELETE' });
		const params = createMockParams({ provider: 'google' });
		const response = await DELETE(req, params);
		const { status } = await parseResponse(response);

		expect(status).toBe(401);
	});

	it('should return 400 for invalid provider', async () => {
		mockGetSessionUser.mockResolvedValue({ id: 1 });

		const req = createMockRequest({ method: 'DELETE' });
		const params = createMockParams({ provider: 'invalid' });
		const response = await DELETE(req, params);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(400);
		expect(body.error).toBe('Invalid provider');
	});

	it('should allow unlinking when user has password as backup', async () => {
		mockGetSessionUser.mockResolvedValue({ id: 1 });
		(db.user.findUnique as any).mockResolvedValue({
			id: 1,
			googleId: 'google-123',
			facebookId: null,
			twitterId: null,
			passwordHash: 'hashed', // Has password backup
		});
		(db.user.update as any).mockResolvedValue({
			id: 1,
			name: 'Test',
			email: 'test@example.com',
			googleId: null,
			facebookId: null,
			twitterId: null,
		});

		const req = createMockRequest({ method: 'DELETE' });
		const params = createMockParams({ provider: 'google' });
		const response = await DELETE(req, params);
		const { status } = await parseResponse(response);

		expect(status).toBe(200);
	});
});
