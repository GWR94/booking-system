import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Rate limit store: IP -> { count, resetAt }
 * In production with multiple instances, use Redis (e.g. @upstash/ratelimit).
 */
const rateLimitStore = new Map<
	string,
	{ count: number; resetAt: number }
>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_SENSITIVE = 10; // contact, password reset, register
const MAX_REQUESTS_BOOKING = 30; // booking and payment-intent

/** Paths that use the stricter limit (auth/contact). */
const SENSITIVE_PATHS = [
	'/api/contact',
	'/api/user/request-password-reset',
	'/api/user/reset-password',
	'/api/user/register',
];

/** Paths that use the booking limit. */
const BOOKING_PATHS = ['/api/bookings', '/api/bookings/payment-intent'];

function getClientId(request: NextRequest): string {
	const forwarded = request.headers.get('x-forwarded-for');
	const realIp = request.headers.get('x-real-ip');
	return (
		(forwarded?.split(',')[0]?.trim()) ||
		realIp?.trim() ||
		'unknown'
	);
}

function getLimit(pathname: string): number {
	if (SENSITIVE_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
		return MAX_REQUESTS_SENSITIVE;
	}
	if (BOOKING_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
		return MAX_REQUESTS_BOOKING;
	}
	return MAX_REQUESTS_SENSITIVE;
}

function isRateLimitedPath(pathname: string): boolean {
	return [
		...SENSITIVE_PATHS,
		...BOOKING_PATHS,
	].some((p) => pathname === p || pathname.startsWith(p + '/'));
}

function rateLimit(request: NextRequest): NextResponse | null {
	const pathname = request.nextUrl.pathname;
	if (!isRateLimitedPath(pathname)) {
		return null;
	}

	const id = getClientId(request);
	const now = Date.now();
	const limit = getLimit(pathname);

	let entry = rateLimitStore.get(id);
	if (!entry) {
		entry = { count: 0, resetAt: now + WINDOW_MS };
		rateLimitStore.set(id, entry);
	}
	if (now >= entry.resetAt) {
		entry.count = 0;
		entry.resetAt = now + WINDOW_MS;
	}
	entry.count += 1;

	// Prune old entries (simple cleanup to avoid unbounded growth)
	if (rateLimitStore.size > 10_000) {
		for (const [key, val] of rateLimitStore.entries()) {
			if (now >= val.resetAt) rateLimitStore.delete(key);
		}
	}

	if (entry.count > limit) {
		const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
		return NextResponse.json(
			{ error: 'Too Many Requests', message: 'Rate limit exceeded. Please try again later.' },
			{
				status: 429,
				headers: {
					'Retry-After': String(retryAfter),
					'X-RateLimit-Limit': String(limit),
					'X-RateLimit-Remaining': '0',
				},
			},
		);
	}

	return null;
}

/** Apply security headers to API responses. */
function securityHeaders(response: NextResponse): NextResponse {
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	return response;
}

export function proxy(request: NextRequest) {
	// Rate limit sensitive and booking API routes
	const rateLimitResponse = rateLimit(request);
	if (rateLimitResponse) {
		return securityHeaders(rateLimitResponse);
	}

	const response = NextResponse.next();
	return securityHeaders(response);
}

export const config = {
	matcher: [
		'/api/contact',
		'/api/user/request-password-reset',
		'/api/user/reset-password',
		'/api/user/register',
		'/api/bookings/:path*',
	],
};
