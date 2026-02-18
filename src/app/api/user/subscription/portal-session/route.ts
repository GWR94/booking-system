export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@db';
import { getSessionUser } from '@/server/auth/auth';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

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

		const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

		const session = await stripe.billingPortal.sessions.create({
			customer: user.stripeCustomerId,
			return_url: `${baseUrl}/profile`,
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
