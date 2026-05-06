import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleSendEmail } from './email';
import nodemailer from 'nodemailer';
import path from 'path';
import { existsSync, readFileSync } from 'fs';

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
				text: expect.any(String),
			}),
		);
	});

	it('sends plain-text fallback for each template', async () => {
		const cases = [
			{
				templateName: 'confirmation' as const,
				templateContext: {
					booking: { id: 12, slots: [] },
					payment: { intentId: 'pi_1', amount: '20.00' },
				},
			},
			{
				templateName: 'password-reset' as const,
				templateContext: {
					name: 'Sam',
					resetUrl: 'https://example.com/reset',
					expiresAtFormatted: '31 Mar 2026 at 12:00',
				},
			},
			{
				templateName: 'contact-form' as const,
				templateContext: {
					name: 'Sam',
					email: 'sam@example.com',
					subject: 'Help',
					message: 'Need help',
				},
			},
			{
				templateName: 'refund-failed-alert' as const,
				templateContext: {
					bookingId: 22,
					paymentId: 'pi_2',
					userEmail: 'sam@example.com',
					detectedAtFormatted: '31 Mar 2026 at 12:00',
				},
			},
			{
				templateName: 'pending-payment-reminder' as const,
				templateContext: {
					bookingId: 33,
					resumeUrl: 'https://example.com/profile/bookings',
					expiresAtFormatted: '31 Mar 2026 at 13:00',
				},
			},
		];

		for (const testCase of cases) {
			await handleSendEmail({
				recipientEmail: 'test@test.com',
				senderPrefix: 'test',
				subject: 'Test Subject',
				templateName: testCase.templateName,
				templateContext: testCase.templateContext,
			});
		}

		expect(mockTransporter.sendMail).toHaveBeenCalledTimes(cases.length);
		for (const call of mockTransporter.sendMail.mock.calls) {
			expect(call[0]).toEqual(
				expect.objectContaining({
					text: expect.any(String),
				}),
			);
			expect((call[0].text as string).length).toBeGreaterThan(10);
		}
	});

	it('keeps all active templates on shared branded layout', () => {
		const templateNames = [
			'confirmation',
			'password-reset',
			'contact-form',
			'refund-failed-alert',
			'pending-payment-reminder',
		];
		for (const templateName of templateNames) {
			const templatePath = path.resolve(
				process.cwd(),
				`src/templates/emails/${templateName}.hbs`,
			);
			expect(existsSync(templatePath)).toBe(true);
			const source = readFileSync(templatePath, 'utf8');
			expect(source).toContain('{{> header}}');
			expect(source).toContain('{{> footer}}');
		}
	});
});
