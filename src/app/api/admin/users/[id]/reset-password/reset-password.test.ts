import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockIsAdmin } = vi.hoisted(() => ({
	mockIsAdmin: vi.fn(),
}));

const { mockDb } = vi.hoisted(() => ({
	mockDb: {
		user: { findUnique: vi.fn(), update: vi.fn() },
	},
}));

const { mockHandleSendEmail } = vi.hoisted(() => ({
	mockHandleSendEmail: vi.fn(),
}));

vi.mock('@db', () => ({
	db: mockDb,
}));

vi.mock('@auth', () => ({
	isAdmin: mockIsAdmin,
}));

vi.mock('@utils/email', () => ({
	handleSendEmail: mockHandleSendEmail,
}));

import { POST } from './route';
import { createMockRequest } from '@test/api-test-utils';

describe('POST /api/admin/users/[id]/reset-password', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		process.env.ACCESS_TOKEN_SECRET = 'test-secret';
		process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
	});

	it('should return 403 if user is not an admin', async () => {
		mockIsAdmin.mockResolvedValue(false);

		const req = createMockRequest({ method: 'POST' });
		const response = await POST(req, { params: Promise.resolve({ id: '1' }) });

		expect(response.status).toBe(403);
	});

	it('should generate token and send email if admin', async () => {
		mockIsAdmin.mockResolvedValue(true);
		mockDb.user.findUnique.mockResolvedValue({
			id: 2,
			name: 'Test',
			email: 'test@example.com',
		});
		mockDb.user.update.mockResolvedValue({ id: 2 });

		const req = createMockRequest({ method: 'POST' });
		const response = await POST(req, { params: Promise.resolve({ id: '2' }) });

		expect(response.status).toBe(200);
		expect(mockDb.user.update).toHaveBeenCalled();
		expect(mockHandleSendEmail).toHaveBeenCalled();
		const data = await response.json();
		expect(data.message).toBe("Password reset link sent to user's email");
	});
});
