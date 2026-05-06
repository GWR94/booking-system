export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@db';
import { getSessionUser } from '@/server/auth/auth';
import { getStripe } from '@/server/lib/stripe';

const stripe = getStripe();

const resolveBaseUrl = (req: NextRequest) => {
	const configured = (process.env.NEXT_PUBLIC_APP_URL ?? '').trim();
	if (configured) {
		if (/^https?:\/\//i.test(configured)) return configured;
		const isLocal =
			configured.startsWith('localhost') ||
			configured.startsWith('127.0.0.1');
		return `${isLocal ? 'http' : 'https'}://${configured}`;
	}
	return req.nextUrl?.origin ?? 'http://localhost:3000';
};

export const POST = async (req: NextRequest) => {
	const sessionUser = await getSessionUser();

	if (!sessionUser) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const user = await db.user.findUnique({
			where: { id: sessionUser.id },
		});

		if (!user || !user.stripeCustomerId) {
			return NextResponse.json(
				{ error: 'User has no subscription to manage' },
				{ status: 400 },
			);
		}

		const baseUrl = resolveBaseUrl(req);

		const session = await stripe.billingPortal.sessions.create({
			customer: user.stripeCustomerId,
			return_url: `${baseUrl}/profile/settings`,
		});

		return NextResponse.json({ url: session.url });
	} catch (error) {
		console.error('Create portal session error:', error);
		return NextResponse.json(
			{
				error: error instanceof Error ? error.message : 'Internal Server Error',
			},
			{ status: 500 },
		);
	}
};
