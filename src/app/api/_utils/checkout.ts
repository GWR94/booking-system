import {
	checkoutGuestInfoSchema,
	checkoutIdentityModeSchema,
	checkoutRequestSchema,
	type CheckoutIdentityMode,
	type CheckoutRequest,
	type CheckoutValidationError,
} from '@/features/checkout/checkout-contract';

type NormalizeCheckoutInput = {
	items: Array<{ slotIds: number[] }>;
	guestInfo?: { name: string; email: string; phone?: string };
	recaptchaToken?: string;
	sessionUserId?: number | null;
};

export function normalizeCheckoutRequest(
	input: NormalizeCheckoutInput,
): { request: CheckoutRequest | null; errors: CheckoutValidationError[] } {
	const errors: CheckoutValidationError[] = [];
	const mode: CheckoutIdentityMode =
		input.sessionUserId != null ? 'authenticated' : 'guest';

	const modeCheck = checkoutIdentityModeSchema.safeParse(mode);
	if (!modeCheck.success) {
		errors.push({
			code: 'MISSING_IDENTITY',
			message: 'Unable to determine checkout identity mode',
		});
		return { request: null, errors };
	}

	if (!input.items.length) {
		errors.push({
			code: 'EMPTY_BASKET',
			message: 'At least one basket item is required',
			field: 'items',
		});
	}

	if (mode === 'guest') {
		if (!input.guestInfo) {
			errors.push({
				code: 'MISSING_GUEST_INFO',
				message: 'Guest checkout requires name and email',
				field: 'guestInfo',
			});
		} else {
			const guest = checkoutGuestInfoSchema.safeParse(input.guestInfo);
			if (!guest.success) {
				errors.push({
					code: 'INVALID_GUEST_INFO',
					message: guest.error.issues[0]?.message ?? 'Invalid guest info',
					field: guest.error.issues[0]?.path?.join('.') ?? 'guestInfo',
				});
			}
		}
	}

	if (errors.length > 0) return { request: null, errors };

	const request = checkoutRequestSchema.parse({
		identityMode: mode,
		items: input.items,
		guestInfo: mode === 'guest' ? input.guestInfo : undefined,
		recaptchaToken: input.recaptchaToken,
	});

	return { request, errors: [] };
}

