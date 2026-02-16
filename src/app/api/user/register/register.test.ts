import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockDb } = vi.hoisted(() => ({
	mockDb: {
		user: { findUnique: vi.fn(), create: vi.fn(), update: vi.fn() },
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

describe('POST /api/user/register', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should return 400 for invalid input', async () => {
		const req = createMockRequest({
			method: 'POST',
			body: { name: '', email: 'invalid', password: '123' },
		});
		const response = await POST(req);
		expect(response.status).toBe(400);
	});

	it('should return 409 if user already exists', async () => {
		mockDb.user.findUnique.mockResolvedValue({ id: 1, passwordHash: 'exists' });
		const req = createMockRequest({
			method: 'POST',
			body: { name: 'Test', email: 'test@test.com', password: 'password123' },
		});
		const response = await POST(req);
		expect(response.status).toBe(409);
	});

	it('should register successfully if user is new', async () => {
		mockDb.user.findUnique.mockResolvedValue(null);
		mockBcrypt.hash.mockResolvedValue('hashed');
		mockDb.user.create.mockResolvedValue({ id: 2, email: 'test@test.com' });

		const req = createMockRequest({
			method: 'POST',
			body: { name: 'Test', email: 'test@test.com', password: 'password123' },
		});
		const response = await POST(req);

		expect(response.status).toBe(201);
		expect(mockDb.user.create).toHaveBeenCalled();
	});
});
