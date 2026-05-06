import { NextResponse } from 'next/server';
import { getSessionUser } from '@/server/auth/auth';
import { auth } from '@/auth';
import { errorResponse } from './responses';

export type SessionUser = Awaited<ReturnType<typeof getSessionUser>>;

export type RequireSessionResult =
	| { ok: true; user: NonNullable<SessionUser> }
	| { ok: false; response: NextResponse };

/**
 * Use in routes that require an authenticated session (no guest).
 * Check `!result.ok` and return `result.response`; otherwise use `result.user`.
 */
export async function requireSession(): Promise<RequireSessionResult> {
	const user = await getSessionUser();
	if (!user) {
		return { ok: false, response: errorResponse('Authentication required', 401, 'AUTH_REQUIRED') };
	}
	return { ok: true, user };
}

export type GuestInfo = { name: string; email: string; phone?: string };

export type RequireSessionOrGuestResult =
	| { ok: true; user: NonNullable<SessionUser>; guestInfo?: undefined }
	| { ok: true; user?: undefined; guestInfo: GuestInfo }
	| { ok: false; response: NextResponse };

export type RequireCheckoutSessionOrGuestResult =
	| { ok: true; sessionUserId: number; guestInfo?: undefined }
	| { ok: true; sessionUserId?: undefined; guestInfo: GuestInfo }
	| { ok: false; response: NextResponse };

/**
 * Use in routes that allow either a session or guest info (e.g. checkout, create booking).
 * Check `!result.ok` and return `result.response`; otherwise use `result.user` and/or `result.guestInfo`.
 */
export async function requireSessionOrGuest(
	guestInfo: GuestInfo | undefined,
): Promise<RequireSessionOrGuestResult> {
	const user = await getSessionUser();
	if (user) return { ok: true, user };
	if (guestInfo?.email?.trim()) return { ok: true, guestInfo };
	if (guestInfo && !guestInfo.email?.trim()) {
		return {
			ok: false,
			response: errorResponse(
				'Guest email is required for guest checkout',
				400,
				'VALIDATION_ERROR',
			),
		};
	}
	return {
		ok: false,
		response: errorResponse(
			'Authentication or guest details required',
			401,
			'AUTH_REQUIRED',
		),
	};
}

/**
 * Checkout-only auth: trust the NextAuth session for user id, without
 * requiring a DB user lookup. Guest fallback remains unchanged.
 */
export async function requireCheckoutSessionOrGuest(
	guestInfo: GuestInfo | undefined,
): Promise<RequireCheckoutSessionOrGuestResult> {
	const session = await auth();
	const sessionUserIdRaw = session?.user?.id;
	const sessionUserId =
		typeof sessionUserIdRaw === 'string' || typeof sessionUserIdRaw === 'number'
			? Number(sessionUserIdRaw)
			: NaN;

	if (Number.isFinite(sessionUserId) && sessionUserId > 0) {
		return { ok: true, sessionUserId };
	}

	if (guestInfo?.email?.trim()) return { ok: true, guestInfo };
	if (guestInfo && !guestInfo.email?.trim()) {
		return {
			ok: false,
			response: errorResponse(
				'Guest email is required for guest checkout',
				400,
				'VALIDATION_ERROR',
			),
		};
	}

	return {
		ok: false,
		response: errorResponse(
			'Authentication or guest details required',
			401,
			'AUTH_REQUIRED',
		),
	};
}
