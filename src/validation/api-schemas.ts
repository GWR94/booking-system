import Joi from 'joi';

/**
 * Server-side validation schemas for API routes
 * These are simpler versions for backend validation
 */

// Authentication schemas
export const apiLoginSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required(),
	rememberMe: Joi.boolean().optional(),
});

export const apiRegisterSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
});

// Contact form schema
export const apiContactSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().email().required(),
	phone: Joi.string().allow('').optional(),
	subject: Joi.string().required(),
	message: Joi.string().required(),
});

// Booking schemas
export const apiBookingCreateSchema = Joi.object({
	slotIds: Joi.array()
		.items(Joi.number().integer().positive())
		.min(1)
		.required(),
	paymentId: Joi.string().allow('').optional(),
	paymentStatus: Joi.string().allow('').optional(),
	guestInfo: Joi.object({
		name: Joi.string().min(1).required(),
		email: Joi.string().email().required(),
		phone: Joi.string().allow('').optional(),
	}).optional(),
});

export const apiPaymentIntentSchema = Joi.object({
	items: Joi.array()
		.items(
			Joi.object({
				slotIds: Joi.array()
					.items(Joi.number().integer().positive())
					.min(1)
					.required(),
			}),
		)
		.min(1)
		.required(),
	guestInfo: Joi.object({
		name: Joi.string().min(1).required(),
		email: Joi.string().email().required(),
		phone: Joi.string().allow('').optional(),
	}).optional(),
	recaptchaToken: Joi.string().allow('').optional(),
});

// User/profile schemas
export const apiUserProfileUpdateSchema = Joi.object({
	name: Joi.string().min(1).optional(),
	email: Joi.string().email().optional(),
	phone: Joi.string().allow('').optional(),
	allowMarketing: Joi.boolean().optional(),
});

// Admin schemas
export const apiAdminLocalBookingSchema = Joi.object({
	slotIds: Joi.array()
		.items(Joi.number().integer().positive())
		.min(1)
		.required(),
});

export const apiAdminBookingStatusSchema = Joi.object({
	status: Joi.string().min(1).required(),
});

export const apiAdminBookingExtendSchema = Joi.object({
	hours: Joi.number().valid(1, 2).required(),
});

export const apiAdminSlotCreateSchema = Joi.object({
	startTime: Joi.date().iso().required(),
	endTime: Joi.date().iso().required(),
	status: Joi.string().min(1).optional(),
	bay: Joi.alternatives()
		.try(
			Joi.number().integer().positive(),
			Joi.object({
				id: Joi.number().integer().positive().required(),
			}),
		)
		.required(),
});

export const apiAdminSlotUpdateSchema = Joi.object({
	startTime: Joi.date().iso().required(),
	endTime: Joi.date().iso().required(),
	status: Joi.string().min(1).required(),
	bay: Joi.alternatives()
		.try(
			Joi.number().integer().positive(),
			Joi.object({
				id: Joi.number().integer().positive().required(),
			}),
		)
		.optional(),
});

export const apiAdminSlotBlockSchema = Joi.object({
	startTime: Joi.date().iso().required(),
	endTime: Joi.date().iso().required(),
	bayId: Joi.number().integer().positive().optional(),
});

export const apiAdminUserUpdateSchema = Joi.object({
	name: Joi.string().min(1).optional(),
	email: Joi.string().email().optional(),
	role: Joi.string().valid('admin', 'user', 'guest').optional(),
	membershipTier: Joi.string()
		.valid('PAR', 'BIRDIE', 'HOLEINONE')
		.allow(null)
		.optional(),
	membershipStatus: Joi.string()
		.valid('ACTIVE', 'CANCELLED')
		.allow(null)
		.optional(),
});

// Password reset schemas
export const apiRequestPasswordResetSchema = Joi.object({
	email: Joi.string().email().required(),
});

export const apiResetPasswordSchema = Joi.object({
	token: Joi.string().min(1).required(),
	password: Joi.string().min(6).required(),
});

// Subscription schema
export const apiSubscriptionTierSchema = Joi.object({
	tier: Joi.string().valid('PAR', 'BIRDIE', 'HOLEINONE').required(),
});
