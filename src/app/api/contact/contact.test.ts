import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockEmail } = vi.hoisted(() => ({
	mockEmail: {
		handleSendEmail: vi.fn(),
		isSmtpConfigured: vi.fn(),
	},
}));

vi.mock('@utils/email', () => ({
	handleSendEmail: mockEmail.handleSendEmail,
	isSmtpConfigured: mockEmail.isSmtpConfigured,
	missingSmtpEnvKeys: vi.fn(() => ['SMTP_PASS or EMAIL_PASS']),
}));

import { POST } from './route';
import { createMockRequest } from '@test/api-test-utils';
import COMPANY_DATA from '@/constants/company';

describe('POST /api/contact', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockEmail.isSmtpConfigured.mockReturnValue(true);
	});

	it('should send email successfully with valid data', async () => {
		mockEmail.handleSendEmail.mockResolvedValue(undefined);

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
		expect(data.success).toBe(true);
		expect(data.message).toBe('Message sent successfully');
		expect(mockEmail.handleSendEmail).toHaveBeenCalledWith({
			recipientEmail: COMPANY_DATA.email,
			subject: 'New Contact Form: Test Subject',
			templateName: 'contact-form',
			templateContext: {
				name: 'John Doe',
				email: 'john@example.com',
				phone: undefined,
				subject: 'Test Subject',
				message: 'Test Message',
			},
			replyTo: 'john@example.com',
			rethrow: true,
		});
	});

	it('should return 503 when SMTP is not configured', async () => {
		mockEmail.isSmtpConfigured.mockReturnValue(false);

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

		expect(response.status).toBe(503);
		expect(mockEmail.handleSendEmail).not.toHaveBeenCalled();
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
