import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleSendEmail } from './email';
import nodemailer from 'nodemailer';

const { mockTransporter } = vi.hoisted(() => ({
	mockTransporter: {
		sendMail: vi.fn().mockResolvedValue({ messageId: '123' }),
		use: vi.fn(),
	},
}));

vi.mock('nodemailer', () => ({
	default: {
		createTransport: vi.fn().mockReturnValue(mockTransporter),
	},
}));

vi.mock('nodemailer-express-handlebars', () => ({
	default: vi.fn(),
}));

describe('email utilities', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should send email successfully with correct props', async () => {
		await handleSendEmail({
			recipientEmail: 'test@test.com',
			senderPrefix: 'test',
			subject: 'Test Subject',
			templateName: 'contact-form',
			templateContext: { name: 'Test' },
		});

		expect(mockTransporter.sendMail).toHaveBeenCalledWith(
			expect.objectContaining({
				to: 'test@test.com',
				subject: 'Test Subject',
				template: 'contact-form',
			}),
		);
	});
});
