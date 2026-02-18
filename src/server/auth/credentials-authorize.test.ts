import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authorizeCredentials } from './credentials-authorize';

const mockFindUnique = vi.fn();
const mockCompare = vi.fn();

const mockDb = {
	user: {
		findUnique: (...args: unknown[]) => mockFindUnique(...args),
	},
};

const mockBcrypt = {
	compare: (...args: unknown[]) => mockCompare(...args),
};

describe('authorizeCredentials', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should return null when email or password is missing', async () => {
		expect(await authorizeCredentials(undefined, mockDb as any, mockBcrypt as any)).toBeNull();
		expect(await authorizeCredentials({}, mockDb as any, mockBcrypt as any)).toBeNull();
		expect(await authorizeCredentials({ email: 'a@b.com' }, mockDb as any, mockBcrypt as any)).toBeNull();
		expect(await authorizeCredentials({ password: 'x' }, mockDb as any, mockBcrypt as any)).toBeNull();
		expect(mockFindUnique).not.toHaveBeenCalled();
	});

	it('should return null when user not found', async () => {
		mockFindUnique.mockResolvedValue(null);
		const result = await authorizeCredentials(
			{ email: 'nobody@example.com', password: 'any' },
			mockDb as any,
			mockBcrypt as any,
		);
		expect(result).toBeNull();
		expect(mockFindUnique).toHaveBeenCalledWith({
			where: { email: 'nobody@example.com' },
		});
	});

	it('should return null when user has no password (social-only)', async () => {
		mockFindUnique.mockResolvedValue({
			id: 1,
			email: 'oauth@example.com',
			passwordHash: null,
			name: null,
			role: 'user',
			membershipTier: null,
			membershipStatus: null,
		});
		const result = await authorizeCredentials(
			{ email: 'oauth@example.com', password: 'any' },
			mockDb as any,
			mockBcrypt as any,
		);
		expect(result).toBeNull();
		expect(mockCompare).not.toHaveBeenCalled();
	});

	it('should return null when password is invalid', async () => {
		mockFindUnique.mockResolvedValue({
			id: 1,
			email: 'user@example.com',
			passwordHash: 'hashed',
			name: 'User',
			role: 'user',
			membershipTier: null,
			membershipStatus: null,
		});
		mockCompare.mockResolvedValue(false);
		const result = await authorizeCredentials(
			{ email: 'user@example.com', password: 'wrong' },
			mockDb as any,
			mockBcrypt as any,
		);
		expect(result).toBeNull();
		expect(mockCompare).toHaveBeenCalledWith('wrong', 'hashed');
	});

	it('should return user object when credentials are valid', async () => {
		const dbUser = {
			id: 1,
			email: 'user@example.com',
			name: 'Test User',
			passwordHash: 'hashed',
			role: 'user',
			membershipTier: 'PAR',
			membershipStatus: 'ACTIVE',
		};
		mockFindUnique.mockResolvedValue(dbUser);
		mockCompare.mockResolvedValue(true);
		const result = await authorizeCredentials(
			{ email: 'user@example.com', password: 'correct' },
			mockDb as any,
			mockBcrypt as any,
		);
		expect(result).toEqual({
			id: '1',
			email: 'user@example.com',
			name: 'Test User',
			role: 'user',
			membershipTier: 'PAR',
			membershipStatus: 'ACTIVE',
		});
		expect(mockCompare).toHaveBeenCalledWith('correct', 'hashed');
	});

	it('should return user with undefined tier/status when db user has null', async () => {
		mockFindUnique.mockResolvedValue({
			id: 2,
			email: 'n tier@example.com',
			name: 'No Tier',
			passwordHash: 'hash',
			role: 'user',
			membershipTier: null,
			membershipStatus: null,
		});
		mockCompare.mockResolvedValue(true);
		const result = await authorizeCredentials(
			{ email: 'n tier@example.com', password: 'pass' },
			mockDb as any,
			mockBcrypt as any,
		);
		expect(result).toEqual({
			id: '2',
			email: 'n tier@example.com',
			name: 'No Tier',
			role: 'user',
			membershipTier: undefined,
			membershipStatus: undefined,
		});
	});
});
