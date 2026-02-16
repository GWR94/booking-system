/**
 * Canonical app URL. One env var: NEXT_PUBLIC_APP_URL (readable on server and client).
 */

export function getServerAppUrl(): string {
	return process.env.NEXT_PUBLIC_APP_URL ?? '';
}

/** Base URL for redirects (Stripe success/cancel, etc.). */
export function getAuthBaseUrl(): string {
	return process.env.NEXT_PUBLIC_APP_URL ?? '';
}

export function getLogoUrl(): string {
	return process.env.LOGO_URL ?? '';
}
