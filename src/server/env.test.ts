import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('server env', () => {
	beforeEach(() => {
		const stub = (key: string, value: string) =>
			vi.stubEnv(key, process.env[key] || value);
		stub('NODE_ENV', 'test');
		stub('DATABASE_URL', 'postgres://localhost/test');
		stub('AUTH_SECRET', 'test-secret');
		stub('STRIPE_SECRET_KEY', 'sk_test_xxx');
		stub('STRIPE_WEBHOOK_SECRET', 'whsec_test');
		stub('ACCESS_TOKEN_SECRET', 'test-access-token');
		stub('CRON_SECRET', 'test-cron');
		stub('NEXT_PUBLIC_APP_URL', 'http://localhost:3000');
		stub('LOGO_URL', 'https://example.com/logo.png');
		stub('SMTP_HOST', 'localhost');
		stub('SMTP_PORT', '1025');
		stub('SMTP_SECURE', 'false');
		stub('SMTP_USER', 'test');
		stub('SMTP_PASS', 'test');
		stub('EMAIL_HOST', 'localhost');
		stub('EMAIL_PORT', '1025');
		stub('EMAIL_SECURE', 'false');
		stub('EMAIL_USER', 'test');
		stub('EMAIL_PASS', 'test');
		stub('GOOGLE_CLIENT_ID', 'google-id');
		stub('GOOGLE_CLIENT_SECRET', 'google-secret');
		stub('FACEBOOK_CLIENT_ID', 'fb-id');
		stub('FACEBOOK_APP_SECRET', 'fb-secret');
		stub('TWITTER_CLIENT_ID', 'twitter-id');
		stub('TWITTER_CLIENT_SECRET', 'twitter-secret');
		stub('STRIPE_PRICE_ID_PAR', 'price_par');
		stub('STRIPE_PRICE_ID_BIRDIE', 'price_birdie');
		stub('STRIPE_PRICE_ID_HOLEINONE', 'price_holeinone');
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it('exports serverEnv with required keys when env is valid', async () => {
		vi.resetModules();
		const { serverEnv } = await import('./env');
		expect(serverEnv).toBeDefined();
		expect(serverEnv.NODE_ENV).toBeDefined();
		expect(serverEnv.DATABASE_URL).toBeDefined();
		expect(serverEnv.AUTH_SECRET).toBeDefined();
		expect(serverEnv.STRIPE_SECRET_KEY).toBeDefined();
	});

	it('throws when DATABASE_URL is missing', async () => {
		vi.stubEnv('DATABASE_URL', '');
		vi.resetModules();
		await expect(import('./env')).rejects.toThrow(/Invalid server environment/);
	});
});
