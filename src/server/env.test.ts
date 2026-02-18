import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('server env', () => {
	beforeEach(() => {
		vi.stubEnv('NODE_ENV', 'test');
		vi.stubEnv('DATABASE_URL', process.env.DATABASE_URL || 'postgres://localhost/test');
		vi.stubEnv('AUTH_SECRET', process.env.AUTH_SECRET || 'test-secret');
		vi.stubEnv('STRIPE_SECRET_KEY', process.env.STRIPE_SECRET_KEY || 'sk_test_xxx');
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
