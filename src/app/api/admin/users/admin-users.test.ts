import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@db', () => ({
	db: {
		user: { findMany: vi.fn() },
	},
}));

vi.mock('@auth', () => ({
	isAdmin: vi.fn(),
}));

import { GET } from './route';
import { createMockRequest } from '@test/api-test-utils';
import { db } from '@db';
import { isAdmin } from '@/server/auth/auth';

describe('GET /api/admin/users', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should return 403 if user is not an admin', async () => {
		(isAdmin as any).mockResolvedValue(false);

		const response = await GET();

		expect(response.status).toBe(403);
		const data = await response.json();
		expect(data.error).toBe('Unauthorized');
	});

	it('should return all users if user is an admin', async () => {
		(isAdmin as any).mockResolvedValue(true);

		const mockUsers = [{ id: 1, name: 'Test User', bookings: [] }];
		(db.user.findMany as any).mockResolvedValue(mockUsers);

		const response = await GET();

		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data).toEqual(mockUsers);
		expect(db.user.findMany).toHaveBeenCalled();
	});

	it('should return 500 on database error', async () => {
		(isAdmin as any).mockResolvedValue(true);
		(db.user.findMany as any).mockRejectedValue(new Error('DB Error'));

		const response = await GET();

		expect(response.status).toBe(500);
		const data = await response.json();
		expect(data.error).toBe('DB Error');
	});
});
