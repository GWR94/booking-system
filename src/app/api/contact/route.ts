export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { parseWithFirstError } from '@lib/zod';
import { apiContactSchema } from '@validation/api-schemas';
import { errorResponse } from '@/app/api/_utils/responses';
import COMPANY_DATA from '@/constants/company';
import {
	handleSendEmail,
	isSmtpConfigured,
	missingSmtpEnvKeys,
} from '@utils/email';

export const POST = async (req: NextRequest) => {
	try {
		if (!isSmtpConfigured()) {
			console.error(
				'Contact form error: SMTP is not configured. Missing:',
				missingSmtpEnvKeys().join(', '),
			);
			return errorResponse(
				'Email service is not configured',
				503,
				'SMTP_NOT_CONFIGURED',
			);
		}

		const body = await req.json();
		const parsed = parseWithFirstError(apiContactSchema, body);
		if (!parsed.success) {
			return errorResponse(parsed.message, 400);
		}
		const { name, email, phone, subject, message } = parsed.data;

		await handleSendEmail({
			recipientEmail: COMPANY_DATA.email,
			subject: `New Contact Form: ${subject}`,
			templateName: 'contact-form',
			templateContext: { name, email, phone, subject, message },
			replyTo: email,
			rethrow: true,
		});

		return NextResponse.json({
			success: true,
			message: 'Message sent successfully',
		});
	} catch (err) {
		console.error('Contact form error:', err);
		return errorResponse('Internal Server Error', 500);
	}
};
