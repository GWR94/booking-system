export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@db';
import { getSessionUser } from '@/server/auth/auth';
import { MEMBERSHIP_TIERS, MembershipTier } from '@config/membership.config';
import Stripe from 'stripe';
import { parseWithFirstError } from '@lib/zod';
import { apiSubscriptionTierSchema } from '@validation/api-schemas';
import { errorResponse } from '@/app/api/_utils/responses';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const POST = async (req: NextRequest) => {
	const sessionUser = await getSessionUser();

	if (!sessionUser) {
		return errorResponse('Unauthorized', 401);
	}

	try {
		const body = await req.json();
		const parsed = parseWithFirstError(apiSubscriptionTierSchema, body);
		if (!parsed.success) {
			return errorResponse(parsed.message, 400);
		}
		const { tier } = parsed.data;

		const selectedTier = MEMBERSHIP_TIERS[tier as MembershipTier];

		const user = await db.user.findUnique({
			where: { id: sessionUser.id },
		});

		if (!user) {
			return errorResponse('User not found', 404);
		}

		let customerId = user.stripeCustomerId;

		if (!customerId) {
			const customer = await stripe.customers.create({
				email: user.email || undefined,
				name: user.name,
				metadata: { userId: user.id.toString() },
			});

			customerId = customer.id;

			await db.user.update({
				where: { id: user.id },
				data: { stripeCustomerId: customerId },
			});
		} else if (user.email) {
			await stripe.customers.update(customerId, {
				email: user.email,
				name: user.name,
			});
		}

		const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

		const session = await stripe.checkout.sessions.create({
			customer: customerId,
			mode: 'subscription',
			payment_method_types: ['card'],
			line_items: [
				{
					price: selectedTier.priceId,
					quantity: 1,
				},
			],
			success_url: `${baseUrl}/profile?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${baseUrl}/membership`,
			metadata: {
				userId: user.id.toString(),
				tier: tier,
			},
		});

		return NextResponse.json({ sessionId: session.id, url: session.url });
	} catch (err) {
		console.error('Create subscription session error:', err);
		return errorResponse(
			err instanceof Error ? err.message : 'Internal Server Error',
			500,
		);
	}
};
