import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import { logger } from './logger';
import COMPANY_DATA from '../constants/company';
import { getEmailLogoUrl, getEmailSiteUrl } from './site-url';
import path from 'path';
import dayjs from 'dayjs';

/**
 * Available email template names
 */
type EmailTemplateName =
	| 'confirmation'
	| 'password-reset'
	| 'contact-form'
	| 'refund-failed-alert'
	| 'pending-payment-reminder';

/**
 * Props for sending templated emails
 */
interface SendConfirmProps<T extends EmailTemplateName> {
	/** Email address of the recipient */
	recipientEmail: string;
	/** Email subject line */
	subject: string;
	/** Name of the Handlebars template (e.g. 'confirmation', 'password-reset') */
	templateName: T;
	/** Context/variables passed to the template */
	templateContext: Record<string, unknown>;
	/** Optional reply-to email address */
	replyTo?: string;
	/** When true, rethrow after logging so API routes can return an error response */
	rethrow?: boolean;
}

const smtpEnv = () => ({
	host: process.env.SMTP_HOST || process.env.EMAIL_HOST,
	user: process.env.SMTP_USER || process.env.EMAIL_USER,
	pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
});

/** Env keys required for outbound mail (host, user, and password). */
export const missingSmtpEnvKeys = (): string[] => {
	const { host, user, pass } = smtpEnv();
	const missing: string[] = [];
	if (!host) missing.push('SMTP_HOST or EMAIL_HOST');
	if (!user) missing.push('SMTP_USER or EMAIL_USER');
	if (!pass) missing.push('SMTP_PASS or EMAIL_PASS');
	return missing;
};

export const isSmtpConfigured = (): boolean =>
	missingSmtpEnvKeys().length === 0;

const getContextValue = (context: Record<string, unknown>, key: string) => {
	const value = context[key];
	return typeof value === 'string' || typeof value === 'number'
		? String(value)
		: '';
};

const buildPlainTextFallback = (
	templateName: EmailTemplateName,
	context: Record<string, unknown>,
) => {
	switch (templateName) {
		case 'confirmation':
			const bookingId =
				typeof context.booking === 'object' &&
				context.booking !== null &&
				'id' in context.booking
					? String((context.booking as { id: string | number }).id)
					: '';
			return [
				bookingId ? `Booking #${bookingId} confirmed.` : 'Booking confirmed.',
				'Your booking and payment were successfully processed.',
				`Manage booking: ${getContextValue(context, 'baseUrl')}/profile/bookings`,
			]
				.filter(Boolean)
				.join('\n');
		case 'password-reset':
			return [
				'Password reset request',
				`Reset link: ${getContextValue(context, 'resetUrl')}`,
				`Expires: ${getContextValue(context, 'expiresAtFormatted')}`,
			]
				.filter(Boolean)
				.join('\n');
		case 'contact-form':
			return [
				'New contact form submission',
				`Name: ${getContextValue(context, 'name')}`,
				`Email: ${getContextValue(context, 'email')}`,
				`Subject: ${getContextValue(context, 'subject')}`,
				`Message: ${getContextValue(context, 'message')}`,
			]
				.filter(Boolean)
				.join('\n');
		case 'refund-failed-alert':
			return [
				'Refund failed - manual action required',
				`Booking ID: ${getContextValue(context, 'bookingId')}`,
				`Payment Intent: ${getContextValue(context, 'paymentId')}`,
				`Customer: ${getContextValue(context, 'userEmail')}`,
				`Detected: ${getContextValue(context, 'detectedAtFormatted')}`,
			]
				.filter(Boolean)
				.join('\n');
		case 'pending-payment-reminder':
			return [
				'Pending booking payment reminder',
				`Booking ID: ${getContextValue(context, 'bookingId')}`,
				`Expires: ${getContextValue(context, 'expiresAtFormatted')}`,
				`Complete payment: ${getContextValue(context, 'resumeUrl')}`,
			]
				.filter(Boolean)
				.join('\n');
		default:
			return 'Please view this email in an HTML-capable client.';
	}
};

const transporter = nodemailer.createTransport({
	host: smtpEnv().host,
	port: Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || '465'),
	secure:
		process.env.SMTP_SECURE === 'true' || process.env.EMAIL_SECURE === 'true',
	auth: {
		user: smtpEnv().user,
		pass: smtpEnv().pass,
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

const formatFromAddress = () =>
	`"${COMPANY_DATA.name}" <${COMPANY_DATA.email}>`;

/**
 * Sends a templated email using Handlebars templates.
 *
 * Uses configured SMTP settings to send professional HTML emails
 * with Handlebars templating for dynamic content.
 *
 * Templates are located in: src/templates/emails/
 * Partials are located in: src/templates/partials/
 *
 * @param props - See {@link SendConfirmProps} for property descriptions
 * @returns Nodemailer send result
 * @throws Error if email fails to send or SMTP is not configured
 *
 * @example
 * // Booking confirmation
 * await handleSendEmail({
 *   recipientEmail: 'user@example.com',
 *   subject: 'Your booking is confirmed!',
 *   templateName: 'confirmation',
 *   templateContext: { booking, payment, baseUrl }
 * });
 *
 * @example
 * // Password reset email
 * await handleSendEmail({
 *   recipientEmail: 'user@example.com',
 *   subject: 'Reset your password',
 *   templateName: 'password-reset',
 *   templateContext: { resetUrl, expiresIn: '1 hour' },
 *   replyTo: 'support@example.com'
 * });
 */
export const handleSendEmail = async <T extends EmailTemplateName>({
	recipientEmail,
	subject,
	templateName,
	templateContext,
	replyTo,
	rethrow = false,
}: SendConfirmProps<T>) => {
	try {
		const fromAddress = formatFromAddress();
		const baseUrl = getEmailSiteUrl();
		const normalizedContext = {
			...templateContext,
			baseUrl,
			logoUrl: getEmailLogoUrl(baseUrl),
			year: new Date().getFullYear(),
		};
		const plainText = buildPlainTextFallback(templateName, normalizedContext);

		const mailOptions = {
			from: fromAddress,
			to: recipientEmail,
			replyTo,
			subject,
			template: templateName,
			context: normalizedContext,
			text: plainText,
		};

		await transporter.sendMail(mailOptions as any);
		logger.info(
			`Email sent successfully to: ${recipientEmail} (${templateName})`,
		);
	} catch (error) {
		logger.error(`Error sending email: ${error}`);
		if (rethrow) {
			throw error;
		}
	}
};

interface SendRefundFailedEmailProps {
	/** ID of the cancelled booking */
	bookingId: number;
	/** Stripe payment intent ID that failed to refund */
	paymentId: string;
	/** Email of the customer (for staff reference) */
	userEmail: string;
}

/**
 * Sends the "refund failed" alert to staff when a Stripe refund fails on cancellation.
 *
 * Recipient is taken from {@link COMPANY_CONFIG.email}. Uses the `refund-failed-alert`
 * template so staff can follow up manually.
 *
 * @param params - See {@link SendRefundFailedEmailProps} for property descriptions
 *
 * @example
 * await sendRefundFailedAlert({
 *   bookingId: 42,
 *   paymentId: 'pi_xxx',
 *   userEmail: booking.user?.email ?? 'unknown',
 * });
 */
export const sendRefundFailedAlert = async ({
	bookingId,
	paymentId,
	userEmail,
}: SendRefundFailedEmailProps) => {
	const staffEmail = COMPANY_DATA.email;
	await handleSendEmail({
		recipientEmail: staffEmail,
		subject: `Refund failed – Booking #${bookingId} (manual action required)`,
		templateName: 'refund-failed-alert',
		templateContext: {
			bookingId,
			paymentId,
			userEmail,
			detectedAtFormatted: dayjs().format('DD MMM YYYY [at] HH:mm'),
		},
	});
};

interface SendPendingPaymentReminderProps {
	bookingId: number;
	recipientEmail: string;
	resumeUrl: string;
	expiresAt: Date;
}

export const sendPendingPaymentReminder = async ({
	bookingId,
	recipientEmail,
	resumeUrl,
	expiresAt,
}: SendPendingPaymentReminderProps) => {
	await handleSendEmail({
		recipientEmail,
		subject: `Complete your pending booking #${bookingId}`,
		templateName: 'pending-payment-reminder',
		templateContext: {
			bookingId,
			resumeUrl,
			expiresAtFormatted: dayjs(expiresAt).format('DD MMM YYYY [at] HH:mm'),
		},
	});
};
