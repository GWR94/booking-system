export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@db';
import { getSessionUser } from '@/server/auth/auth';

const ALLOWED_PROVIDERS = ['google', 'facebook', 'twitter'] as const;
type Provider = (typeof ALLOWED_PROVIDERS)[number];

export const DELETE = async (
	req: NextRequest,
	{ params }: { params: Promise<{ provider: string }> },
) => {
	const sessionUser = await getSessionUser();

	if (!sessionUser) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { provider } = await params;

	if (!ALLOWED_PROVIDERS.includes(provider as Provider)) {
		return NextResponse.json(
			{ error: 'Invalid provider' },
			{ status: 400 },
		);
	}

	try {
		const user = await db.user.findUnique({
			where: { id: sessionUser.id },
		});

		if (!user) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 },
			);
		}

		// Safety check: prevent lockout
		const activeProviderCount = [
			user.googleId,
			user.facebookId,
			user.twitterId,
		].filter((id) => !!id).length;

		const hasPassword = !!user.passwordHash;

		if (!hasPassword && activeProviderCount <= 1) {
			return NextResponse.json(
				{
					error:
						'Cannot disconnect your only login method. Please set a password or connect another account first.',
				},
				{ status: 400 },
			);
		}

		const updatedUser = await db.user.update({
			where: { id: user.id },
			data: {
				[`${provider}Id`]: null,
			},
			select: {
				id: true,
				name: true,
				email: true,
				googleId: true,
				facebookId: true,
				twitterId: true,
			},
		});

		return NextResponse.json({
			message: `${provider} disconnected successfully`,
			user: updatedUser,
		});
	} catch (error) {
		console.error('Unlink provider error:', error);
		return NextResponse.json(
			{
				error:
					error instanceof Error ? error.message : 'Internal Server Error',
			},
			{ status: 500 },
		);
	}
};
