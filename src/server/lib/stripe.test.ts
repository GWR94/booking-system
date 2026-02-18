import { describe, it, expect, vi, beforeEach } from 'vitest';

const MockStripe = vi.fn().mockImplementation(() => ({ paymentIntents: {}, customers: {} }));

vi.mock('stripe', () => ({
	default: MockStripe,
}));

describe('getStripe', () => {
	beforeEach(() => {
		vi.resetModules();
		process.env.STRIPE_SECRET_KEY = 'sk_test_xxx';
	});

	it('creates Stripe instance with STRIPE_SECRET_KEY and returns it', async () => {
		const { getStripe } = await import('./stripe');
		const stripe = getStripe();
		expect(stripe).toBeDefined();
		expect(MockStripe).toHaveBeenCalledWith(
			'sk_test_xxx',
			expect.objectContaining({
				apiVersion: expect.any(String),
			}),
		);
	});

	it('returns same instance on second call (singleton)', async () => {
		const { getStripe } = await import('./stripe');
		const a = getStripe();
		const b = getStripe();
		expect(a).toBe(b);
	});
});
