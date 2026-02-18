import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger } from './logger';

describe('logger', () => {
	const originalEnv = process.env.NODE_ENV;

	beforeEach(() => {
		vi.spyOn(console, 'log').mockImplementation(() => {});
		vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.spyOn(console, 'warn').mockImplementation(() => {});
		vi.spyOn(console, 'debug').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
		process.env.NODE_ENV = originalEnv;
	});

	it('info logs message with prefix', () => {
		logger.info('test message');
		expect(console.log).toHaveBeenCalledWith('[INFO] test message', '');
	});

	it('info logs message with meta', () => {
		logger.info('user event', { userId: 1 });
		expect(console.log).toHaveBeenCalledWith('[INFO] user event', { userId: 1 });
	});

	it('error logs message with prefix', () => {
		logger.error('something failed');
		expect(console.error).toHaveBeenCalledWith('[ERROR] something failed', '');
	});

	it('error logs message with meta', () => {
		logger.error('payment failed', { code: 'CARD_DECLINED' });
		expect(console.error).toHaveBeenCalledWith('[ERROR] payment failed', {
			code: 'CARD_DECLINED',
		});
	});

	it('warn logs message with prefix', () => {
		logger.warn('deprecation');
		expect(console.warn).toHaveBeenCalledWith('[WARN] deprecation', '');
	});

	it('warn logs message with meta', () => {
		logger.warn('rate limit', { remaining: 5 });
		expect(console.warn).toHaveBeenCalledWith('[WARN] rate limit', { remaining: 5 });
	});

	it('debug does not log when NODE_ENV is not development', () => {
		process.env.NODE_ENV = 'production';
		logger.debug('debug message');
		expect(console.debug).not.toHaveBeenCalled();
	});

	it('debug logs when NODE_ENV is development', () => {
		process.env.NODE_ENV = 'development';
		logger.debug('debug message');
		expect(console.debug).toHaveBeenCalledWith('[DEBUG] debug message', '');
	});

	it('debug logs with meta when NODE_ENV is development', () => {
		process.env.NODE_ENV = 'development';
		logger.debug('cache hit', { key: 'user:1' });
		expect(console.debug).toHaveBeenCalledWith('[DEBUG] cache hit', { key: 'user:1' });
	});
});
