import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockDb } = vi.hoisted(() => ({
	mockDb: {
		user: { findUnique: vi.fn(), update: vi.fn() },
	},
}));

const { mockEmail } = vi.hoisted(() => ({
	mockEmail: {
		handleSendEmail: vi.fn(),
	},
}));

vi.mock('@db', () => ({
	db: mockDb,
}));

vi.mock('@utils/email', () => ({
	handleSendEmail: mockEmail.handleSendEmail,
}));

import { POST } from './route';
import { createMockRequest } from '@test/api-test-utils';

describe('POST /api/user/request-password-reset', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should return success even if user not found', async () => {
		mockDb.user.findUnique.mockResolvedValue(null);
		const req = createMockRequest({
			method: 'POST',
			body: { email: 'none@test.com' },
		});
		const response = await POST(req);

		expect(response.status).toBe(200);
		expect(mockDb.user.update).not.toHaveBeenCalled();
	});

	it('should generate token and send email if user exists', async () => {
		mockDb.user.findUnique.mockResolvedValue({ id: 1, email: 'test@test.com' });
		const req = createMockRequest({
			method: 'POST',
			body: { email: 'test@test.com' },
		});
		const response = await POST(req);

		expect(response.status).toBe(200);
		expect(mockDb.user.update).toHaveBeenCalled();
		expect(mockEmail.handleSendEmail).toHaveBeenCalled();
	});
});
