import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import { logger } from './logger';
import { COMPANY_CONFIG } from '../config/company.config';
import path from 'path';

/**
 * Available email template names
 */
type EmailTemplateName = 'confirmation' | 'password-reset' | 'contact-form';

interface ConfirmationEmailContext {
	booking: {
		id: number;
		slots: {
			startTime: string;
			endTime: string;
			date: string;
		}[];
	};
	payment: {
		intentId: string;
		amount: string;
	};
	baseUrl: string;
	logoUrl: string;
	year: number;
}

/**
 * Props for sending templated emails
 */
interface SendConfirmProps<T extends EmailTemplateName> {
	/** Email address of the recipient */
	recipientEmail: string;
	/** Prefix for the sender name (e.g., 'Booking Confirmation') */
	senderPrefix: string;
	/** Email subject line */
	subject: string;
	/** Name of the Handlebars template to use */
	templateName: T;
	/** Context/variables to pass to the email template */
	templateContext: Record<string, unknown>;
	/** Optional reply-to email address */
	replyTo?: string;
}

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST || process.env.EMAIL_HOST,
	port: Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || '465'),
	secure:
		process.env.SMTP_SECURE === 'true' || process.env.EMAIL_SECURE === 'true',
	auth: {
		user: process.env.SMTP_USER || process.env.EMAIL_USER,
		pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
	},
});

const handlebarOptions = {
	viewEngine: {
		extname: '.hbs',
		partialsDir: path.resolve(process.cwd(), 'src/templates/partials'),
		layoutsDir: path.resolve(process.cwd(), 'src/templates/emails'),
		defaultLayout: false as const, // Fix type issue
	},
	viewPath: path.resolve(process.cwd(), 'src/templates/emails'),
	extName: '.hbs',
};

transporter.use('compile', hbs(handlebarOptions));

/**
 * Sends a templated email using Handlebars templates
 *
 * Uses configured SMTP settings to send professional HTML emails
 * with Handlebars templating for dynamic content.
 *
 * Templates are located in: src/templates/emails/
 * Partials are located in: src/templates/partials/
 *
 * @param props - Email configuration and template data
 * @returns Nodemailer send result
 * @throws Error if email fails to send or SMTP is not configured
 * @example
 * await handleSendEmail({
 *   recipientEmail: 'user@example.com',
 *   senderPrefix: 'booking',
 *   subject: 'Your booking is confirmed!',
 *   templateName: 'confirmation',
 *   templateContext: { booking, payment, baseUrl }
 * });
 *
 * @example
 * // Password reset email
 * await handleSendEmail({
 *   recipientEmail: 'user@example.com',
 *   senderPrefix: 'noreply',
 *   subject: 'Reset your password',
 *   templateName: 'password-reset',
 *   templateContext: { resetUrl, expiresIn: '1 hour' },
 *   replyTo: 'support@example.com'
 * });
 */
export const handleSendEmail = async <T extends EmailTemplateName>({
	recipientEmail,
	senderPrefix,
	subject,
	templateName,
	templateContext,
	replyTo,
}: SendConfirmProps<T>) => {
	try {
		const fromAddress = `${senderPrefix}@${COMPANY_CONFIG.emailDomain}`;

		const mailOptions = {
			from: fromAddress,
			to: recipientEmail,
			replyTo,
			subject,
			template: templateName,
			context: templateContext,
		};

		await transporter.sendMail(mailOptions as any);
		logger.info(
			`Email sent successfully to: ${recipientEmail} (${templateName})`,
		);
	} catch (error) {
		logger.error(`Error sending email: ${error}`);
	}
};
