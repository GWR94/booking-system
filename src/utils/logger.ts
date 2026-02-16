/**
 * Simple logging utility with different severity levels
 *
 * Provides consistent logging format across the application.
 * Debug logs only appear in development environment.
 *
 * @example
 * logger.info('User logged in', { userId: 123 });
 * logger.error('Payment failed', { error: err.message });
 * logger.warn('Rate limit approaching', { remaining: 10 });
 * logger.debug('Cache hit', { key: 'user:123' });
 */
export const logger = {
	/**
	 * Log informational messages
	 * @param message - The message to log
	 * @param meta - Optional metadata object
	 */
	info: (message: string, meta?: any) => {
		console.log(`[INFO] ${message}`, meta || '');
	},

	/**
	 * Log error messages
	 * @param message - The error message
	 * @param meta - Optional error details or metadata
	 */
	error: (message: string, meta?: any) => {
		console.error(`[ERROR] ${message}`, meta || '');
	},

	/**
	 * Log warning messages
	 * @param message - The warning message
	 * @param meta - Optional metadata
	 */
	warn: (message: string, meta?: any) => {
		console.warn(`[WARN] ${message}`, meta || '');
	},

	/**
	 * Log debug messages (only in development)
	 * @param message - The debug message
	 * @param meta - Optional debug metadata
	 */
	debug: (message: string, meta?: any) => {
		if (process.env.NODE_ENV === 'development') {
			console.debug(`[DEBUG] ${message}`, meta || '');
		}
	},
};
