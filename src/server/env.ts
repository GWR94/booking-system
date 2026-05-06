import { z } from 'zod';

/**
 * Server-side environment variable schema.
 * Validates at runtime when this module is first imported (e.g. by API routes).
 * Use serverEnv in server code for typed access.
 */
const serverEnvSchema = z.object({
	NODE_ENV: z
		.enum(['development', 'production', 'test'])
		.default('development'),
	DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
	AUTH_SECRET: z.string().min(1, 'AUTH_SECRET is required'),

	STRIPE_SECRET_KEY: z.string().min(1, 'STRIPE_SECRET_KEY is required'),
	STRIPE_WEBHOOK_SECRET: z.string().min(1, 'STRIPE_WEBHOOK_SECRET is required'),

	ACCESS_TOKEN_SECRET: z.string().min(1, 'ACCESS_TOKEN_SECRET is required'),
	CRON_SECRET: z.string().min(1, 'CRON_SECRET is required'),

	NEXT_PUBLIC_APP_URL: z.string().min(1, 'NEXT_PUBLIC_APP_URL is required'),
	LOGO_URL: z.string().min(1, 'LOGO_URL is required'),

	SMTP_HOST: z.string().min(1, 'SMTP_HOST is required'),
	SMTP_PORT: z.string().min(1, 'SMTP_PORT is required'),
	SMTP_SECURE: z.string().min(1, 'SMTP_SECURE is required'),
	SMTP_USER: z.string().min(1, 'SMTP_USER is required'),
	SMTP_PASS: z.string().min(1, 'SMTP_PASS is required'),
	EMAIL_HOST: z.string().min(1, 'EMAIL_HOST is required'),
	EMAIL_PORT: z.string().min(1, 'EMAIL_PORT is required'),
	EMAIL_SECURE: z.string().min(1, 'EMAIL_SECURE is required'),
	EMAIL_USER: z.string().min(1, 'EMAIL_USER is required'),
	EMAIL_PASS: z.string().min(1, 'EMAIL_PASS is required'),

	GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
	GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required'),
	FACEBOOK_CLIENT_ID: z.string().min(1, 'FACEBOOK_CLIENT_ID is required'),
	FACEBOOK_APP_SECRET: z.string().min(1, 'FACEBOOK_APP_SECRET is required'),
	TWITTER_CLIENT_ID: z.string().min(1, 'TWITTER_CLIENT_ID is required'),
	TWITTER_CLIENT_SECRET: z.string().min(1, 'TWITTER_CLIENT_SECRET is required'),

	STRIPE_PRICE_ID_PAR: z.string().min(1, 'STRIPE_PRICE_ID_PAR is required'),
	STRIPE_PRICE_ID_BIRDIE: z
		.string()
		.min(1, 'STRIPE_PRICE_ID_BIRDIE is required'),
	STRIPE_PRICE_ID_HOLEINONE: z
		.string()
		.min(1, 'STRIPE_PRICE_ID_HOLEINONE is required'),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

const validate = (): ServerEnv => {
	const parsed = serverEnvSchema.safeParse(process.env);
	if (!parsed.success) {
		const msg = parsed.error.issues
			.map((e) => `${e.path.join('.')}: ${e.message}`)
			.join('; ');
		throw new Error(`Invalid server environment: ${msg}`);
	}
	return parsed.data;
};

/** Validated server env. Import in server code only (API routes, server modules). */
export const serverEnv: ServerEnv = validate();
