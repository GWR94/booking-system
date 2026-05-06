import { z } from 'zod';
import dayjs from 'dayjs';

/**
 * Server-side validation schemas for API routes
 * Using Zod for parsing and type inference
 */

/** Parses to dayjs so routes/services use one type for slot times */
const slotTimeSchema = z.coerce.date().transform((d) => dayjs(d));

const email = z.email();
const optionalEmail = z.email().optional();
const optionalPhone = z.string().optional();

export const apiLoginSchema = z.object({
	email: email,
	password: z.string().min(1),
	rememberMe: z.boolean().optional(),
});

export const apiRegisterSchema = z.object({
	name: z.string().min(1),
	email: email,
	password: z.string().min(6),
});

export const apiContactSchema = z.object({
	name: z.string().min(1),
	email: email,
	phone: optionalPhone,
	subject: z.string().min(1),
	message: z.string().min(1),
});

const guestInfoSchema = z.object({
	name: z.string().min(1),
	email: email,
	phone: optionalPhone,
});
const identityModeSchema = z.enum(['authenticated', 'guest']);

export const apiBookingCreateSchema = z.object({
	slotIds: z.array(z.number().int().positive()).min(1),
	paymentId: z.string().optional(),
	paymentStatus: z.string().optional(),
	guestInfo: guestInfoSchema.optional(),
	identityMode: identityModeSchema.optional(),
});

export const apiPaymentIntentSchema = z.object({
	items: z
		.array(
			z.object({
				slotIds: z.array(z.number().int().positive()).min(1),
			}),
		)
		.min(1),
	guestInfo: guestInfoSchema.optional(),
	recaptchaToken: z.string().optional(),
	identityMode: identityModeSchema.optional(),
});

export const apiUserProfileUpdateSchema = z.object({
	name: z.string().min(1).optional(),
	email: optionalEmail,
	phone: optionalPhone,
	allowMarketing: z.boolean().optional(),
});

export const apiAdminLocalBookingSchema = z.object({
	slotIds: z.array(z.number().int().positive()).min(1),
});

export const apiAdminBookingStatusSchema = z.object({
	status: z.string().min(1),
});

export const apiAdminBookingExtendSchema = z.object({
	hours: z.union([z.literal(1), z.literal(2)]),
});

const bayIdSchema = z.number().int().positive();

export const apiAdminSlotCreateSchema = z.object({
	startTime: slotTimeSchema,
	endTime: slotTimeSchema,
	status: z.string().min(1).optional(),
	bay: bayIdSchema,
});

export const apiAdminSlotUpdateSchema = z.object({
	startTime: slotTimeSchema,
	endTime: slotTimeSchema,
	status: z.string().min(1),
	bay: bayIdSchema,
});

export const apiAdminSlotBlockSchema = z.object({
	startTime: slotTimeSchema,
	endTime: slotTimeSchema,
	bayId: z.number().int().positive().optional(),
});

export const apiAdminUserUpdateSchema = z.object({
	name: z.string().min(1).optional(),
	email: optionalEmail,
	role: z.enum(['admin', 'user', 'guest']).optional(),
	// optional = omit key → undefined (don't change). nullable = send null → clear value.
	membershipTier: z.enum(['PAR', 'BIRDIE', 'HOLEINONE']).nullable().optional(),
	membershipStatus: z.enum(['ACTIVE', 'CANCELLED']).nullable().optional(),
});

export const apiRequestPasswordResetSchema = z.object({
	email: email,
});

export const apiResetPasswordSchema = z.object({
	token: z.string().min(1),
	password: z.string().min(6),
});

export const apiSubscriptionTierSchema = z.object({
	tier: z.enum(['PAR', 'BIRDIE', 'HOLEINONE']),
});

export const apiSlotCreateSchema = z.object({
	startTime: slotTimeSchema,
	endTime: slotTimeSchema,
	status: z.string().min(1).optional(),
	bay: bayIdSchema,
});

export const apiAdminBookingsQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).default(10),
	search: z.string().optional(),
});

export const apiAdminSlotsQuerySchema = z.object({
	date: z
		.string()
		.refine((s) => !Number.isNaN(Date.parse(s)), {
			message: 'Date is required and must be a valid date',
		}),
	bayId: z
		.string()
		.regex(/^\d+$/, { message: 'bayId must be a positive integer' })
		.optional(),
});

/** GET /api/slots: either ids (comma-separated) or both from and to (date or ISO date-time) */
const slotDateParam = z
	.string()
	.refine((s) => !Number.isNaN(Date.parse(s)), {
		message: 'Must be a valid date or ISO date-time string',
	});
export const apiSlotsQuerySchema = z
	.object({
		from: slotDateParam.optional(),
		to: slotDateParam.optional(),
		ids: z.string().optional(),
	})
	.refine(
		(data) =>
			(data.ids !== undefined && data.ids.length > 0) ||
			(data.from !== undefined && data.to !== undefined),
		{ message: 'Either ids or both from and to are required' },
	);

export const apiStripeWebhookHeaderSchema = z.object({
	signature: z.string().min(1, 'Missing Stripe signature header'),
});

export const apiStripeWebhookPayloadSchema = z
	.string()
	.min(1, 'Webhook payload cannot be empty');
