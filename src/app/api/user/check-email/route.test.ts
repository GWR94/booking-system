import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockRequest, parseResponse } from '@test/api-test-utils';

vi.mock('@db', () => ({
	db: {
		user: {
			findUnique: vi.fn(),
		},
	},
}));

import { GET } from './route';
import { db } from '@db';

describe('GET /api/user/check-email', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should return exists: true when email is found', async () => {
		(db.user.findUnique as any).mockResolvedValue({
			id: 1,
			email: 'test@example.com',
			role: 'user',
		});

		const req = createMockRequest({
			url: 'http://localhost:3000/api/user/check-email',
			query: { email: 'test@example.com' },
		});

		const response = await GET(req);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(200);
		expect(body.exists).toBe(true);
		expect(body.role).toBe('user');
		expect(db.user.findUnique).toHaveBeenCalledWith({
			where: { email: 'test@example.com' },
		});
	});

	it('should return exists: false when email is not found', async () => {
		(db.user.findUnique as any).mockResolvedValue(null);

		const req = createMockRequest({
			url: 'http://localhost:3000/api/user/check-email',
			query: { email: 'nobody@example.com' },
		});

		const response = await GET(req);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(200);
		expect(body.exists).toBe(false);
	});

	it('should return 400 when email is missing', async () => {
		const req = createMockRequest({
			url: 'http://localhost:3000/api/user/check-email',
		});

		const response = await GET(req);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(400);
		expect(body.message).toBe('Email is required');
	});

	it('should return exists: false on database error', async () => {
		(db.user.findUnique as any).mockRejectedValue(new Error('DB error'));

		const req = createMockRequest({
			url: 'http://localhost:3000/api/user/check-email',
			query: { email: 'test@example.com' },
		});

		const response = await GET(req);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(200);
		expect(body.exists).toBe(false);
		expect(body.error).toBe(true);
	});
});
