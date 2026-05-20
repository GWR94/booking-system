/** Public site origin with no trailing slash (matches canonical URLs in JSON-LD). */
export function normalizeSiteUrl(url: string): string {
	if (url == null || url === '') {
		throw new TypeError(
			'normalizeSiteUrl: expected a non-empty URL string (got empty or undefined)',
		);
	}
	return url.replace(/\/$/, '');
}

const DEV_FALLBACK_ORIGIN = 'http://localhost:3000';

/**
 * Normalizes a configured origin (adds http/https when the scheme is omitted).
 */
export function resolveSiteOrigin(raw: string): string {
	const trimmed = raw.trim();
	if (!trimmed) {
		throw new TypeError('resolveSiteOrigin: expected a non-empty URL string');
	}
	if (/^https?:\/\//i.test(trimmed)) {
		return normalizeSiteUrl(trimmed);
	}
	const isLocal =
		trimmed.startsWith('localhost') || trimmed.startsWith('127.0.0.1');
	return normalizeSiteUrl(`${isLocal ? 'http' : 'https'}://${trimmed}`);
}

/**
 * Canonical site URL from `NEXT_PUBLIC_APP_URL`.
 * In non-production, falls back to `http://localhost:3000` when unset so local dev
 * and tests do not crash. Production must set the env var.
 */
export function getPublicSiteUrl(): string {
	const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
	if (raw) {
		return resolveSiteOrigin(raw);
	}
	if (process.env.NODE_ENV === 'production') {
		throw new Error(
			'NEXT_PUBLIC_APP_URL is required in production. Set it in your hosting environment.',
		);
	}
	return DEV_FALLBACK_ORIGIN;
}

/**
 * Origin used in outbound email (links, logo). Uses `EMAIL_SITE_URL` when set so
 * local dev can point emails at a public deployment without changing the browser URL.
 */
export function getEmailSiteUrl(): string {
	const emailOverride = process.env.EMAIL_SITE_URL?.trim();
	if (emailOverride) {
		return resolveSiteOrigin(emailOverride);
	}
	return getPublicSiteUrl();
}

/**
 * Absolute logo URL for HTML email. Email clients must fetch a public HTTPS URL.
 */
export function getEmailLogoUrl(siteUrl: string): string {
	const logo = process.env.LOGO_URL?.trim();
	if (logo && logo.length > 0) {
		if (/^https?:\/\//i.test(logo)) {
			return logo;
		}
		return `${siteUrl}/${logo.replace(/^\//, '')}`;
	}
	return `${siteUrl}/logo.webp`;
}
