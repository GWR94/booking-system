import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockUserFindUnique = vi.fn();
const mockUserCreate = vi.fn();
const mockUserUpdate = vi.fn();

vi.mock('@db', () => ({
	db: {
		user: {
			findUnique: (...args: unknown[]) => mockUserFindUnique(...args),
			create: (...args: unknown[]) => mockUserCreate(...args),
			update: (...args: unknown[]) => mockUserUpdate(...args),
		},
	},
}));

describe('auth.config', () => {
	let authConfig: Awaited<typeof import('./auth.config')>['default'];

	beforeEach(async () => {
		vi.clearAllMocks();
		vi.resetModules();
		authConfig = (await import('./auth.config')).default;
	});

	afterEach(() => {
		vi.resetModules();
	});

	it('should have Credentials provider with authorize that delegates to authorizeCredentials', async () => {
		const credentialsProvider = authConfig.providers?.find(
			(p: { id?: string }) => p.id === 'credentials',
		) as { authorize?: (credentials: Record<string, string | undefined>) => Promise<unknown> };
		expect(credentialsProvider?.authorize).toBeDefined();
		expect(await credentialsProvider!.authorize!({})).toBeNull();
	});

	describe('callbacks.jwt', () => {
		it('should add id, role, membershipTier, membershipStatus to token when user is present', async () => {
			const jwt = authConfig.callbacks?.jwt;
			expect(jwt).toBeDefined();
			const token = {};
			const user = {
				id: '42',
				email: 'u@u.com',
				name: 'U',
				role: 'admin',
				membershipTier: 'BIRDIE' as const,
				membershipStatus: 'ACTIVE' as const,
			};
			const result = await (jwt as any)({ token, user });
			expect(result).toEqual({
				id: '42',
				role: 'admin',
				membershipTier: 'BIRDIE',
				membershipStatus: 'ACTIVE',
			});
		});

		it('should return token unchanged when user is not present', async () => {
			const jwt = authConfig.callbacks?.jwt;
			const token = { id: '1', role: 'user' };
			const result = await (jwt as any)({ token, user: undefined });
			expect(result).toBe(token);
		});
	});

	describe('callbacks.session', () => {
		it('should add id, role, membershipTier, membershipStatus to session.user', async () => {
			const sessionCb = authConfig.callbacks?.session;
			expect(sessionCb).toBeDefined();
			const sessionArg = {
				session: { user: { email: 'u@u.com', name: 'U' } },
				token: {
					id: '10',
					role: 'user',
					membershipTier: 'PAR',
					membershipStatus: 'ACTIVE',
				},
			};
			const result = await (sessionCb as any)(sessionArg);
			expect(result.user).toMatchObject({
				email: 'u@u.com',
				name: 'U',
				id: '10',
				role: 'user',
				membershipTier: 'PAR',
				membershipStatus: 'ACTIVE',
			});
		});
	});

	describe('callbacks.signIn', () => {
		it('should return true for credentials provider', async () => {
			const signIn = authConfig.callbacks?.signIn;
			expect(signIn).toBeDefined();
			const result = await (signIn as any)({
				user: { email: 'u@u.com' },
				account: { provider: 'credentials' },
			});
			expect(result).toBe(true);
			expect(mockUserFindUnique).not.toHaveBeenCalled();
		});

		it('should create user and return true when OAuth user does not exist', async () => {
			mockUserFindUnique.mockResolvedValue(null);
			mockUserCreate.mockResolvedValue({ id: 1 });
			const signIn = authConfig.callbacks?.signIn;
			const result = await (signIn as any)({
				user: { email: 'new@example.com', name: 'New User' },
				account: { provider: 'google', providerAccountId: 'google-123' },
			});
			expect(result).toBe(true);
			expect(mockUserCreate).toHaveBeenCalledWith({
				data: {
					email: 'new@example.com',
					name: 'New User',
					googleId: 'google-123',
					facebookId: undefined,
					twitterId: undefined,
				},
			});
		});

		it('should update existing user with provider id when missing and return true', async () => {
			mockUserFindUnique.mockResolvedValue({
				id: 1,
				email: 'existing@example.com',
				googleId: null,
				facebookId: null,
				twitterId: null,
			});
			mockUserUpdate.mockResolvedValue({});
			const signIn = authConfig.callbacks?.signIn;
			const result = await (signIn as any)({
				user: { email: 'existing@example.com', name: 'Existing' },
				account: { provider: 'google', providerAccountId: 'google-456' },
			});
			expect(result).toBe(true);
			expect(mockUserUpdate).toHaveBeenCalledWith({
				where: { email: 'existing@example.com' },
				data: { googleId: 'google-456' },
			});
		});

		it('should return false when user has no email (OAuth)', async () => {
			const signIn = authConfig.callbacks?.signIn;
			const result = await (signIn as any)({
				user: { email: null, name: 'No Email' },
				account: { provider: 'google' },
			});
			expect(result).toBe(false);
		});
	});
});
