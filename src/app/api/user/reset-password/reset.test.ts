import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockDb } = vi.hoisted(() => ({
	mockDb: {
		user: { findFirst: vi.fn(), update: vi.fn() },
	},
}));

const { mockBcrypt } = vi.hoisted(() => ({
	mockBcrypt: {
		hash: vi.fn(),
	},
}));

vi.mock('@db', () => ({
	db: mockDb,
}));

vi.mock('bcryptjs', () => ({
	default: mockBcrypt,
}));

import { POST } from './route';
import { createMockRequest } from '@test/api-test-utils';

describe('POST /api/user/reset-password', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should reset password with valid token', async () => {
		mockDb.user.findFirst.mockResolvedValue({ id: 1 });
		mockBcrypt.hash.mockResolvedValue('new_hash');

		const req = createMockRequest({
			method: 'POST',
			body: { token: 'valid', password: 'new_password' },
		});
		const response = await POST(req);

		expect(response.status).toBe(200);
		expect(mockDb.user.update).toHaveBeenCalledWith(
			expect.objectContaining({
				data: expect.objectContaining({ passwordHash: 'new_hash' }),
			}),
		);
	});

	it('should return 400 with invalid token', async () => {
		mockDb.user.findFirst.mockResolvedValue(null);
		const req = createMockRequest({
			method: 'POST',
			body: { token: 'invalid', password: 'password' },
		});
		const response = await POST(req);
		expect(response.status).toBe(400);
	});
});
