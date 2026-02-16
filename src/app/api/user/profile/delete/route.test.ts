import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockRequest, parseResponse } from '@test/api-test-utils';

const mockGetSessionUser = vi.fn();

vi.mock('src/server/auth/auth', () => ({
	getSessionUser: (...args: any[]) => mockGetSessionUser(...args),
}));

vi.mock('@db', () => ({
	db: {
		user: {
			delete: vi.fn(),
		},
	},
}));

import { DELETE } from './route';
import { db } from '@db';

describe('DELETE /api/user/profile/delete', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should delete user successfully', async () => {
		mockGetSessionUser.mockResolvedValue({ id: 1, email: 'test@example.com' });
		(db.user.delete as any).mockResolvedValue({ id: 1 });

		const req = createMockRequest({ method: 'DELETE' });
		const response = await DELETE(req);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(200);
		expect(body.message).toBe('User successfully deleted');
		expect(db.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
	});

	it('should return 401 when not authenticated', async () => {
		mockGetSessionUser.mockResolvedValue(null);

		const req = createMockRequest({ method: 'DELETE' });
		const response = await DELETE(req);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(401);
		expect(body.error).toBe('Unauthorized');
	});

	it('should return 500 on database error', async () => {
		mockGetSessionUser.mockResolvedValue({ id: 1 });
		(db.user.delete as any).mockRejectedValue(new Error('DB error'));

		const req = createMockRequest({ method: 'DELETE' });
		const response = await DELETE(req);
		const { body, status } = await parseResponse(response);

		expect(status).toBe(500);
		expect(body.error).toBe('DB error');
	});
});
