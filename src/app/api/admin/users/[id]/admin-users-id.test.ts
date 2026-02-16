import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockIsAdmin } = vi.hoisted(() => ({
	mockIsAdmin: vi.fn(),
}));

const { mockDb } = vi.hoisted(() => ({
	mockDb: {
		user: { findUnique: vi.fn(), update: vi.fn() },
	},
}));

vi.mock('@db', () => ({
	db: mockDb,
}));

vi.mock('@auth', () => ({
	isAdmin: mockIsAdmin,
}));

import { PUT } from './route';
import { createMockRequest } from '@test/api-test-utils';

describe('PUT /api/admin/users/[id]', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should return 403 if user is not an admin', async () => {
		mockIsAdmin.mockResolvedValue(false);

		const req = createMockRequest({
			method: 'PUT',
			body: { name: 'New Name' },
		});

		const response = await PUT(req, { params: Promise.resolve({ id: '1' }) });

		expect(response.status).toBe(403);
	});

	it('should return 404 if user does not exist', async () => {
		mockIsAdmin.mockResolvedValue(true);
		mockDb.user.findUnique.mockResolvedValue(null);

		const req = createMockRequest({
			method: 'PUT',
			body: { name: 'New Name' },
		});

		const response = await PUT(req, { params: Promise.resolve({ id: '999' }) });

		expect(response.status).toBe(404);
	});

	it('should update user if admin', async () => {
		mockIsAdmin.mockResolvedValue(true);
		mockDb.user.findUnique.mockResolvedValue({ id: 1 });
		mockDb.user.update.mockResolvedValue({ id: 1, name: 'New Name' });

		const req = createMockRequest({
			method: 'PUT',
			body: { name: 'New Name' },
		});

		const response = await PUT(req, { params: Promise.resolve({ id: '1' }) });

		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data.message).toBe('User updated successfully');
	});
});
