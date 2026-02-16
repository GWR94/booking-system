export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@db';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { generateTokens } from '@utils';
import { apiLoginSchema } from '@validation/api-schemas';

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { email, password, rememberMe } = body;

		const { error } = apiLoginSchema.validate({ email, password, rememberMe });
		if (error) {
			return NextResponse.json(
				{ message: error.details[0].message },
				{ status: 400 },
			);
		}

		const user = await db.user.findUnique({
			where: { email },
		});

		if (!user) {
			return NextResponse.json(
				{ message: 'User not found', error: 'USER_NOT_FOUND' },
				{ status: 404 },
			);
		}

		if (!user.passwordHash) {
			return NextResponse.json(
				{
					message: 'User authentication method not supported',
					error: 'WRONG_AUTH_METHOD',
				},
				{ status: 422 },
			);
		}

		const validPassword = await bcrypt.compare(password, user.passwordHash);

		if (!validPassword) {
			return NextResponse.json(
				{ message: 'Incorrect email or password', error: 'INCORRECT_INPUT' },
				{ status: 401 },
			);
		}

		const { accessToken, refreshToken } = generateTokens({
			id: user.id,
			email: user.email!,
			role: user.role,
			facebookId: user.facebookId,
			googleId: user.googleId,
			twitterId: user.twitterId,
		});

		const cookieStore = await cookies();
		const isProduction = process.env.NODE_ENV === 'production';

		cookieStore.set('accessToken', accessToken, {
			httpOnly: true,
			secure: isProduction,
			sameSite: isProduction ? 'none' : 'lax', // 'none' requires secure: true
			maxAge: 15 * 60, // 15 minutes in seconds
			// domain: ... // Let's skip domain for now unless we have subdomains
		});

		const refreshTokenMaxAge = rememberMe
			? 30 * 24 * 60 * 60 // 30 days
			: 7 * 24 * 60 * 60; // 7 days

		cookieStore.set('refreshToken', refreshToken, {
			httpOnly: true,
			secure: isProduction,
			sameSite: isProduction ? 'none' : 'lax',
			path: '/api/user/refresh', // Scope to refresh endpoint
			maxAge: refreshTokenMaxAge,
		});

		// Return user object (excluding sensitive data)
		const { passwordHash, ...userWithoutPassword } = user;
		return NextResponse.json({
			message: 'Login successful',
			user: userWithoutPassword,
		});
	} catch (error) {
		console.error('Login error:', error);
		return NextResponse.json(
			{ message: 'Internal Server Error' },
			{ status: 500 },
		);
	}
}
