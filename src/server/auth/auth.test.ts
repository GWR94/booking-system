import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockAuth = vi.fn();
const mockFindUnique = vi.fn();

vi.mock('../../auth', () => ({
	auth: () => mockAuth(),
}));

vi.mock('@db', () => ({
	db: {
		user: {
			findUnique: (...args: unknown[]) => mockFindUnique(...args),
		},
	},
}));

import { isAdmin, getSessionUser } from './auth';

describe('server auth', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('isAdmin', () => {
		it('returns false when session is null', async () => {
			mockAuth.mockResolvedValue(null);
			expect(await isAdmin()).toBe(false);
		});

		it('returns false when user role is not admin', async () => {
			mockAuth.mockResolvedValue({ user: { role: 'user' } });
			expect(await isAdmin()).toBe(false);
		});

		it('returns true when user role is admin', async () => {
			mockAuth.mockResolvedValue({ user: { role: 'admin' } });
			expect(await isAdmin()).toBe(true);
		});
	});

	describe('getSessionUser', () => {
		it('returns null when session has no user id', async () => {
			mockAuth.mockResolvedValue(null);
			expect(await getSessionUser()).toBeNull();

			mockAuth.mockResolvedValue({ user: {} });
			expect(await getSessionUser()).toBeNull();

			expect(mockFindUnique).not.toHaveBeenCalled();
		});

		it('returns null when user not found in db', async () => {
			mockAuth.mockResolvedValue({ user: { id: '1' } });
			mockFindUnique.mockResolvedValue(null);
			expect(await getSessionUser()).toBeNull();
			expect(mockFindUnique).toHaveBeenCalledWith({
				where: { id: 1 },
			});
		});

		it('returns safe user without passwordHash when found', async () => {
			mockAuth.mockResolvedValue({ user: { id: '5' } });
			mockFindUnique.mockResolvedValue({
				id: 5,
				email: 'u@x.com',
				name: 'User',
				passwordHash: 'secret',
				role: 'user',
				membershipTier: null,
				membershipStatus: null,
			});
			const result = await getSessionUser();
			expect(result).not.toBeNull();
			expect(result).not.toHaveProperty('passwordHash');
			expect(result).toMatchObject({
				id: 5,
				email: 'u@x.com',
				name: 'User',
				role: 'user',
			});
		});

		it('returns null when db throws', async () => {
			mockAuth.mockResolvedValue({ user: { id: '1' } });
			mockFindUnique.mockRejectedValue(new Error('DB error'));
			expect(await getSessionUser()).toBeNull();
		});
	});
});
