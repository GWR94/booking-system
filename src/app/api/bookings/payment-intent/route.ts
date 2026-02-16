import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { db } from '@db';
import { getStripe } from '@lib/stripe';
import { calculateBasketCost } from '@utils';
import { apiPaymentIntentSchema } from '@validation/api-schemas';
import { errorResponse } from '../../_utils/responses';
import { verifyRecaptcha } from 'src/server/lib/recaptcha';

export async function POST(req: NextRequest) {
	try {
		const rawBody = await req.json();
		const { error, value } = apiPaymentIntentSchema.validate(rawBody, {
			abortEarly: false,
			stripUnknown: true,
		});
		if (error) {
			return errorResponse(error.details[0].message, 400, 'VALIDATION_ERROR');
		}

		const { items, guestInfo, recaptchaToken } = value;

		// Guest checkout: require and verify reCAPTCHA (standard server-side verification)
		if (guestInfo) {
			if (
				!recaptchaToken ||
				typeof recaptchaToken !== 'string' ||
				!recaptchaToken.trim()
			) {
				return errorResponse(
					'reCAPTCHA token is required for guest checkout',
					400,
					'RECAPTCHA_REQUIRED',
				);
			}
			const valid = await verifyRecaptcha(recaptchaToken.trim());
			if (!valid) {
				return errorResponse(
					'reCAPTCHA verification failed',
					400,
					'RECAPTCHA_INVALID',
				);
			}
		}

		const slotIds = items.map((item: any) => item.slotIds).flat();

		// Database validation
		const dbSlots = await db.slot.findMany({
			where: {
				id: { in: slotIds },
			},
		});

		if (dbSlots.length !== slotIds.length) {
			const foundIds = dbSlots.map((s: any) => s.id);
			const missingIds = slotIds.filter((id: number) => !foundIds.includes(id));
			return NextResponse.json(
				{
					error: 'One or more slots not found',
					code: 'SLOT_NOT_FOUND',
					missingSlotIds: missingIds,
				},
				{ status: 400 },
			);
		}

		const amount = calculateBasketCost(dbSlots as any); // Ensure this function expects dbSlots/TimeSlot array

		const stripe = getStripe();
		const intent = await stripe.paymentIntents.create({
			amount,
			currency: 'gbp',
			metadata: {
				slotIds: JSON.stringify(slotIds),
				isGuest: guestInfo ? 'true' : 'false',
				guestName: guestInfo?.name,
				guestEmail: guestInfo?.email,
				guestPhone: guestInfo?.phone || '',
			},
		});

		return NextResponse.json({ clientSecret: intent.client_secret });
	} catch (error) {
		console.error('Error creating payment intent:', error);
		return errorResponse('Internal Server Error', 500);
	}
}
