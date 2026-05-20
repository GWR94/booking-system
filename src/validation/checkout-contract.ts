import { z } from 'zod';

/**
 * Shared checkout domain contracts used by both UI and API layers.
 *
 * This keeps the guest vs authenticated behaviour aligned and ensures
 * that basket/identity invariants are enforced in one place.
 */

export const checkoutIdentityModeSchema = z.enum(['authenticated', 'guest']);

export type CheckoutIdentityMode = z.infer<typeof checkoutIdentityModeSchema>;

export const checkoutGuestInfoSchema = z.object({
	name: z.string().min(1),
	email: z.string().email(),
	phone: z.string().optional(),
});

export type CheckoutGuestInfo = z.infer<typeof checkoutGuestInfoSchema>;

export const checkoutBasketItemSchema = z.object({
	slotIds: z.array(z.number().int().positive()).min(1),
});

export type CheckoutBasketItem = z.infer<typeof checkoutBasketItemSchema>;

export const checkoutRequestSchema = z.object({
	identityMode: checkoutIdentityModeSchema,
	items: z.array(checkoutBasketItemSchema).min(1),
	guestInfo: checkoutGuestInfoSchema.optional(),
	recaptchaToken: z.string().optional(),
});

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;

export type CheckoutValidationErrorCode =
	| 'EMPTY_BASKET'
	| 'MISSING_IDENTITY'
	| 'MISSING_GUEST_INFO'
	| 'INVALID_GUEST_INFO'
	| 'MISSING_RECAPTCHA'
	| 'UNAUTHENTICATED';

export interface CheckoutValidationError {
	code: CheckoutValidationErrorCode;
	message: string;
	field?: string;
}

export interface NormalizedCheckoutContext {
	request: CheckoutRequest;
	errors: CheckoutValidationError[];
}

