import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockAxiosPost = vi.fn();

vi.mock('axios', () => ({
	default: {
		post: (...args: unknown[]) => mockAxiosPost(...args),
	},
}));

describe('verifyRecaptcha', () => {
	const originalEnv = process.env;

	beforeEach(() => {
		vi.clearAllMocks();
		process.env = { ...originalEnv };
	});

	afterEach(() => {
		process.env = originalEnv;
	});

	it('should return true when secret is not set (skip verification)', async () => {
		delete process.env.RECAPTCHA_SECRET_KEY;
		delete process.env.CAPTCHA_SECRET_KEY;
		const { verifyRecaptcha } = await import('./recaptcha');
		const result = await verifyRecaptcha('any-token');
		expect(result).toBe(true);
		expect(mockAxiosPost).not.toHaveBeenCalled();
	});

	it('should return false when token is empty or whitespace', async () => {
		process.env.RECAPTCHA_SECRET_KEY = 'secret';
		const { verifyRecaptcha } = await import('./recaptcha');
		expect(await verifyRecaptcha('')).toBe(false);
		expect(await verifyRecaptcha('   ')).toBe(false);
		expect(mockAxiosPost).not.toHaveBeenCalled();
	});

	it('should return true when siteverify returns success true', async () => {
		process.env.RECAPTCHA_SECRET_KEY = 'secret';
		mockAxiosPost.mockResolvedValue({ data: { success: true } });
		const { verifyRecaptcha } = await import('./recaptcha');
		const result = await verifyRecaptcha('valid-token');
		expect(result).toBe(true);
		expect(mockAxiosPost).toHaveBeenCalledWith(
			'https://www.google.com/recaptcha/api/siteverify',
			expect.any(String),
			expect.objectContaining({
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			}),
		);
		const body = mockAxiosPost.mock.calls[0][1];
		expect(body).toContain('secret=secret');
		expect(body).toContain('response=valid-token');
	});

	it('should return false when siteverify returns success false', async () => {
		process.env.RECAPTCHA_SECRET_KEY = 'secret';
		mockAxiosPost.mockResolvedValue({ data: { success: false } });
		const { verifyRecaptcha } = await import('./recaptcha');
		const result = await verifyRecaptcha('bad-token');
		expect(result).toBe(false);
	});

	it('should return false when axios throws', async () => {
		process.env.RECAPTCHA_SECRET_KEY = 'secret';
		mockAxiosPost.mockRejectedValue(new Error('Network error'));
		const { verifyRecaptcha } = await import('./recaptcha');
		const result = await verifyRecaptcha('token');
		expect(result).toBe(false);
	});
});
