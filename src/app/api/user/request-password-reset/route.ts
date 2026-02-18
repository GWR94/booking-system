export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@db';
import crypto from 'crypto';
import { handleSendEmail } from '@utils/email';
import { parseWithFirstError } from '@lib/zod';
import { apiRequestPasswordResetSchema } from '@validation/api-schemas';
import { errorResponse } from '@/app/api/_utils/responses';

export const POST = async (req: NextRequest) => {
	try {
		const body = await req.json();
		const parsed = parseWithFirstError(apiRequestPasswordResetSchema, body);
		if (!parsed.success) {
			return errorResponse(parsed.message, 400);
		}
		const { email } = parsed.data;

		const user = await db.user.findUnique({ where: { email } });

		if (!user) {
			// Return success even if user not found for security (prevent email enumeration)
			return NextResponse.json({
				message: 'If an account exists, a reset link has been sent.',
			});
		}

		const token = crypto.randomBytes(32).toString('hex');
		const expires = new Date(Date.now() + 3600000);

		await db.user.update({
			where: { email },
			data: {
				resetToken: token,
				resetTokenExpiry: expires,
			},
		});

		const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

		await handleSendEmail({
			recipientEmail: email,
			senderPrefix: 'Password Reset',
			subject: 'Password Reset Request',
			templateName: 'password-reset',
			templateContext: {
				name: user.name,
				resetUrl,
				year: new Date().getFullYear(),
				baseUrl: process.env.NEXT_PUBLIC_APP_URL,
				logoUrl: process.env.LOGO_URL,
			},
		});

		return NextResponse.json({
			message: 'If an account exists, a reset link has been sent.',
		});
	} catch (err) {
		console.error('Request password reset error:', err);
		return errorResponse('Internal Server Error', 500);
	}
};
