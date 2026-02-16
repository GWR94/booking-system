export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@db';
import crypto from 'crypto';
import { handleSendEmail } from '@utils/email';
import { apiRequestPasswordResetSchema } from '@validation/api-schemas';
import { errorResponse } from 'src/app/api/_utils/responses';
import { getServerAppUrl, getLogoUrl } from 'src/server/lib/app-url';

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { error } = apiRequestPasswordResetSchema.validate(body);
		if (error) {
			return errorResponse(error.details[0].message, 400);
		}
		const { email } = body;

		const user = await db.user.findUnique({ where: { email } });

		if (!user) {
			// Return success even if user not found for security (prevent email enumeration)
			return NextResponse.json({
				message: 'If an account exists, a reset link has been sent.',
			});
		}

		const token = crypto.randomBytes(32).toString('hex');
		const expires = new Date(Date.now() + 3600000); // 1 hour

		await db.user.update({
			where: { email },
			data: {
				resetToken: token,
				resetTokenExpiry: expires,
			},
		});

		const resetUrl = `${getServerAppUrl()}/reset-password?token=${token}`;

		await handleSendEmail({
			recipientEmail: email,
			senderPrefix: 'Password Reset',
			subject: 'Password Reset Request',
			templateName: 'password-reset',
			templateContext: {
				name: user.name,
				resetUrl,
				year: new Date().getFullYear(),
				baseUrl: getServerAppUrl(),
				logoUrl: getLogoUrl(),
			},
		});

		return NextResponse.json({
			message: 'If an account exists, a reset link has been sent.',
		});
	} catch (err) {
		console.error('Request password reset error:', err);
		return errorResponse('Internal Server Error', 500);
	}
}
