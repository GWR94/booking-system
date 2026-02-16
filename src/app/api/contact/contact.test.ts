import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockSendMail } = vi.hoisted(() => ({
	mockSendMail: vi.fn(),
}));

vi.mock('nodemailer', () => ({
	default: {
		createTransport: vi.fn().mockReturnValue({
			sendMail: mockSendMail,
		}),
	},
}));

import { POST } from './route';
import { createMockRequest } from '@test/api-test-utils';

describe('POST /api/contact', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		process.env.SMTP_USER = 'test@example.com';
	});

	it('should send email successfully with valid data', async () => {
		mockSendMail.mockResolvedValue({ messageId: '123' });

		const req = createMockRequest({
			method: 'POST',
			body: {
				name: 'John Doe',
				email: 'john@example.com',
				subject: 'Test Subject',
				message: 'Test Message',
			},
		});

		const response = await POST(req);

		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data.message).toBe('Message sent successfully');
		expect(mockSendMail).toHaveBeenCalled();
	});

	it('should return 400 with invalid email', async () => {
		const req = createMockRequest({
			method: 'POST',
			body: {
				name: 'John Doe',
				email: 'invalid-email',
				subject: 'Test Subject',
				message: 'Test Message',
			},
		});

		const response = await POST(req);

		expect(response.status).toBe(400);
	});
});
