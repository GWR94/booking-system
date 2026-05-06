export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@db';
import { getStripe } from '@lib/stripe';
import { calculateBasketCost } from '@utils';
import { parseWithFirstError } from '@lib/zod';
import { apiPaymentIntentSchema } from '@validation/api-schemas';
import { errorResponse } from '../../_utils/responses';
import { ApiError, asErrorResponse } from '../../_utils/api-error';
import { requireCheckoutSessionOrGuest } from '../../_utils/auth';
import { verifyRecaptcha } from '@/server/lib/recaptcha';
import { BookingService, MembershipService } from '@modules';
import { makeBookingStripePayments } from '@/server/modules/payments/booking-stripe-payments';
import { normalizeCheckoutRequest } from '../../_utils/checkout';

const assertRecaptcha = async (recaptchaToken: unknown) => {
	if (typeof recaptchaToken !== 'string' || !recaptchaToken.trim()) {
		throw new ApiError(
			'reCAPTCHA token is required for guest checkout',
			400,
			'RECAPTCHA_REQUIRED',
		);
	}
	const valid = await verifyRecaptcha(recaptchaToken.trim());
	if (!valid) {
		throw new ApiError(
			'reCAPTCHA verification failed',
			400,
			'RECAPTCHA_INVALID',
		);
	}
};

export const POST = async (req: NextRequest) => {
	try {
		const rawBody = await req.json();
		const parsed = parseWithFirstError(apiPaymentIntentSchema, rawBody);
		if (!parsed.success) {
			return errorResponse(parsed.message, 400, 'VALIDATION_ERROR');
		}
		const { items, guestInfo, recaptchaToken } = parsed.data;

		const auth = await requireCheckoutSessionOrGuest(guestInfo);
		if (!auth.ok) return auth.response;
		const sessionUserId = auth.sessionUserId ?? null;
		const effectiveGuestInfo = auth.guestInfo ?? null;
		const normalized = normalizeCheckoutRequest({
			items,
			guestInfo: effectiveGuestInfo ?? undefined,
			recaptchaToken,
			sessionUserId,
		});
		if (!normalized.request) {
			return errorResponse(
				normalized.errors[0]?.message ?? 'Invalid checkout payload',
				400,
				'VALIDATION_ERROR',
			);
		}
		const checkoutRequest = normalized.request;

		// Guest checkout: require and verify reCAPTCHA (standard server-side verification)
		if (checkoutRequest.identityMode === 'guest') {
			await assertRecaptcha(checkoutRequest.recaptchaToken);
		}

		const slotIds = checkoutRequest.items.map((item: any) => item.slotIds).flat();
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

		const amount = calculateBasketCost(dbSlots);

		const payments = makeBookingStripePayments({
			stripe: getStripe(),
			db,
			bookingService: BookingService,
			membershipService: MembershipService,
		});

		const intent = await payments.createPaymentIntent({
			amount,
			currency: 'gbp',
			slotIds,
			sessionUserId,
			guestInfo: checkoutRequest.guestInfo ?? null,
		});

		return NextResponse.json({ clientSecret: intent.clientSecret });
	} catch (error) {
		const apiErr = asErrorResponse(error);
		if (apiErr) return apiErr;
		console.error('Error creating payment intent:', error);
		return errorResponse('Internal Server Error', 500);
	}
};
