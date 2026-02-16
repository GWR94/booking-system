export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@db';
import bcrypt from 'bcryptjs';
import { apiResetPasswordSchema } from '@validation/api-schemas';
import { errorResponse } from 'src/app/api/_utils/responses';

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { error } = apiResetPasswordSchema.validate(body);
		if (error) {
			return errorResponse(error.details[0].message, 400);
		}
		const { token, password } = body;

		const user = await db.user.findFirst({
			where: {
				resetToken: token,
				resetTokenExpiry: { gt: new Date() },
			},
		});

		if (!user) {
			return errorResponse('Invalid or expired token', 400);
		}

		const passwordHash = await bcrypt.hash(password, 10);

		await db.user.update({
			where: { id: user.id },
			data: {
				passwordHash,
				resetToken: null,
				resetTokenExpiry: null,
			},
		});

		return NextResponse.json({ message: 'Password reset successfully' });
	} catch (err) {
		console.error('Reset password error:', err);
		return errorResponse('Internal Server Error', 500);
	}
}
