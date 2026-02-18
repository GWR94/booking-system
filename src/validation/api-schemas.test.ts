import { describe, it, expect } from 'vitest';
import {
	apiLoginSchema,
	apiRegisterSchema,
	apiContactSchema,
	apiBookingCreateSchema,
	apiPaymentIntentSchema,
	apiSubscriptionTierSchema,
	apiRequestPasswordResetSchema,
	apiResetPasswordSchema,
	apiAdminLocalBookingSchema,
	apiAdminBookingStatusSchema,
	apiAdminBookingExtendSchema,
} from './api-schemas';

describe('api-schemas', () => {
	describe('apiLoginSchema', () => {
		it('should accept valid email and password', () => {
			const result = apiLoginSchema.safeParse({
				email: 'user@example.com',
				password: 'secret',
			});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.rememberMe).toBeUndefined();
			}
		});

		it('should accept rememberMe optional', () => {
			const result = apiLoginSchema.safeParse({
				email: 'a@b.co',
				password: 'x',
				rememberMe: true,
			});
			expect(result.success).toBe(true);
			if (result.success) expect(result.data.rememberMe).toBe(true);
		});

		it('should reject invalid email', () => {
			const result = apiLoginSchema.safeParse({
				email: 'not-an-email',
				password: 'secret',
			});
			expect(result.success).toBe(false);
		});

		it('should reject empty password', () => {
			const result = apiLoginSchema.safeParse({
				email: 'user@example.com',
				password: '',
			});
			expect(result.success).toBe(false);
		});
	});

	describe('apiRegisterSchema', () => {
		it('should accept valid name, email, password (min 6)', () => {
			const result = apiRegisterSchema.safeParse({
				name: 'Test User',
				email: 'test@example.com',
				password: 'password123',
			});
			expect(result.success).toBe(true);
		});

		it('should reject password shorter than 6', () => {
			const result = apiRegisterSchema.safeParse({
				name: 'Test',
				email: 't@t.com',
				password: '12345',
			});
			expect(result.success).toBe(false);
		});
	});

	describe('apiContactSchema', () => {
		it('should accept valid contact with optional phone', () => {
			const result = apiContactSchema.safeParse({
				name: 'Contact',
				email: 'c@example.com',
				subject: 'Hello',
				message: 'Message body',
			});
			expect(result.success).toBe(true);
			const withPhone = apiContactSchema.safeParse({
				name: 'C',
				email: 'c@c.com',
				phone: '07700900123',
				subject: 'S',
				message: 'M',
			});
			expect(withPhone.success).toBe(true);
		});

		it('should reject missing required fields', () => {
			expect(apiContactSchema.safeParse({ name: 'A', email: 'a@a.com' }).success).toBe(false);
		});
	});

	describe('apiBookingCreateSchema', () => {
		it('should accept slotIds and optional guestInfo', () => {
			const result = apiBookingCreateSchema.safeParse({
				slotIds: [1, 2, 3],
			});
			expect(result.success).toBe(true);
			const withGuest = apiBookingCreateSchema.safeParse({
				slotIds: [1],
				guestInfo: { name: 'G', email: 'g@g.com', phone: '07700900000' },
				paymentId: 'pi_xxx',
				paymentStatus: 'succeeded',
			});
			expect(withGuest.success).toBe(true);
		});

		it('should reject empty slotIds', () => {
			const result = apiBookingCreateSchema.safeParse({ slotIds: [] });
			expect(result.success).toBe(false);
		});
	});

	describe('apiPaymentIntentSchema', () => {
		it('should accept items with slotIds and optional guestInfo and recaptchaToken', () => {
			const result = apiPaymentIntentSchema.safeParse({
				items: [{ slotIds: [1, 2] }],
			});
			expect(result.success).toBe(true);
			const full = apiPaymentIntentSchema.safeParse({
				items: [{ slotIds: [1] }],
				guestInfo: { name: 'G', email: 'g@g.com' },
				recaptchaToken: 'token',
			});
			expect(full.success).toBe(true);
		});

		it('should reject empty items array', () => {
			const result = apiPaymentIntentSchema.safeParse({ items: [] });
			expect(result.success).toBe(false);
		});
	});

	describe('apiSubscriptionTierSchema', () => {
		it('should accept PAR, BIRDIE, HOLEINONE', () => {
			expect(apiSubscriptionTierSchema.safeParse({ tier: 'PAR' }).success).toBe(true);
			expect(apiSubscriptionTierSchema.safeParse({ tier: 'BIRDIE' }).success).toBe(true);
			expect(apiSubscriptionTierSchema.safeParse({ tier: 'HOLEINONE' }).success).toBe(true);
		});

		it('should reject invalid tier', () => {
			expect(apiSubscriptionTierSchema.safeParse({ tier: 'INVALID' }).success).toBe(false);
		});
	});

	describe('apiRequestPasswordResetSchema', () => {
		it('should accept valid email', () => {
			expect(apiRequestPasswordResetSchema.safeParse({ email: 'u@u.com' }).success).toBe(true);
		});
	});

	describe('apiResetPasswordSchema', () => {
		it('should accept token and password min 6', () => {
			const result = apiResetPasswordSchema.safeParse({
				token: 'reset-token',
				password: 'newpass123',
			});
			expect(result.success).toBe(true);
		});

		it('should reject short password', () => {
			const result = apiResetPasswordSchema.safeParse({
				token: 't',
				password: '12345',
			});
			expect(result.success).toBe(false);
		});
	});

	describe('apiAdminLocalBookingSchema', () => {
		it('should accept positive slot ids', () => {
			expect(apiAdminLocalBookingSchema.safeParse({ slotIds: [1, 2] }).success).toBe(true);
		});

		it('should reject empty or invalid slotIds', () => {
			expect(apiAdminLocalBookingSchema.safeParse({ slotIds: [] }).success).toBe(false);
			expect(apiAdminLocalBookingSchema.safeParse({ slotIds: [0] }).success).toBe(false);
		});
	});

	describe('apiAdminBookingStatusSchema', () => {
		it('should accept non-empty status', () => {
			expect(apiAdminBookingStatusSchema.safeParse({ status: 'confirmed' }).success).toBe(true);
		});

		it('should reject empty status', () => {
			expect(apiAdminBookingStatusSchema.safeParse({ status: '' }).success).toBe(false);
		});
	});

	describe('apiAdminBookingExtendSchema', () => {
		it('should accept hours 1 or 2 only', () => {
			expect(apiAdminBookingExtendSchema.safeParse({ hours: 1 }).success).toBe(true);
			expect(apiAdminBookingExtendSchema.safeParse({ hours: 2 }).success).toBe(true);
		});

		it('should reject other values', () => {
			expect(apiAdminBookingExtendSchema.safeParse({ hours: 0 }).success).toBe(false);
			expect(apiAdminBookingExtendSchema.safeParse({ hours: 3 }).success).toBe(false);
		});
	});
});
