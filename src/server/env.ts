import { z } from 'zod';

/**
 * Server-side environment variable schema.
 * Validates at runtime when this module is first imported (e.g. by API routes).
 * Use validatedEnv in server code for typed access; optional vars may be undefined.
 */
const serverEnvSchema = z.object({
	// Required for app to run
	NODE_ENV: z
		.enum(['development', 'production', 'test'])
		.default('development'),
	DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
	AUTH_SECRET: z.string().min(1, 'AUTH_SECRET is required'),

	// Stripe (required for payment flows)
	STRIPE_SECRET_KEY: z.string().min(1, 'STRIPE_SECRET_KEY is required'),
	STRIPE_WEBHOOK_SECRET: z.string().optional(),

	// Admin / cron
	ACCESS_TOKEN_SECRET: z.string().optional(),
	CRON_SECRET: z.string().optional(),

	// URLs (optional; used in emails and redirects)
	NEXT_PUBLIC_APP_URL: z.string().optional(),
	LOGO_URL: z.string().optional(),

	// SMTP / email (optional; contact form and password reset)
	SMTP_HOST: z.string().optional(),
	SMTP_PORT: z.string().optional(),
	SMTP_SECURE: z.string().optional(),
	SMTP_USER: z.string().optional(),
	SMTP_PASS: z.string().optional(),
	EMAIL_HOST: z.string().optional(),
	EMAIL_PORT: z.string().optional(),
	EMAIL_SECURE: z.string().optional(),
	EMAIL_USER: z.string().optional(),
	EMAIL_PASS: z.string().optional(),

	// OAuth (optional)
	GOOGLE_CLIENT_ID: z.string().optional(),
	GOOGLE_CLIENT_SECRET: z.string().optional(),
	FACEBOOK_CLIENT_ID: z.string().optional(),
	FACEBOOK_APP_SECRET: z.string().optional(),
	TWITTER_CLIENT_ID: z.string().optional(),
	TWITTER_CLIENT_SECRET: z.string().optional(),

	// Stripe price IDs for membership tiers (optional)
	STRIPE_PRICE_ID_PAR: z.string().optional(),
	STRIPE_PRICE_ID_BIRDIE: z.string().optional(),
	STRIPE_PRICE_ID_HOLEINONE: z.string().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

function validate(): ServerEnv {
	const parsed = serverEnvSchema.safeParse(process.env);
	if (!parsed.success) {
		const msg = parsed.error.issues
			.map((e) => `${e.path.join('.')}: ${e.message}`)
			.join('; ');
		throw new Error(`Invalid server environment: ${msg}`);
	}
	return parsed.data;
}

/** Validated server env. Import in server code only (API routes, server modules). */
export const serverEnv: ServerEnv = validate();
