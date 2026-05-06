/**
 * Client-side analytics helpers. Events are only sent when GA4 is initialized
 * (i.e. user has accepted analytics cookies). Safe to call from any client component.
 */
import ReactGA from 'react-ga4';

function canSend(): boolean {
	if (typeof window === 'undefined') return false;
	return Boolean(ReactGA.isInitialized);
}

function sanitizeParams(
	params?: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> | undefined {
	if (!params) return undefined;
	const entries = Object.entries(params).filter(
		([_, v]) => v !== undefined && v !== null,
	) as [string, string | number | boolean][];
	return entries.length ? Object.fromEntries(entries) : undefined;
}

/**
 * Send a custom event to GA4. No-op if analytics consent not given.
 */
export function trackEvent(
	action: string,
	params?: Record<string, string | number | boolean | undefined>,
): void {
	if (!canSend()) return;
	const safe = sanitizeParams(params);
	ReactGA.event(action, safe ?? {});
}

export function trackAddToCart(params: {
	value?: number;
	currency?: string;
	items?: { item_id?: string; quantity?: number }[];
}): void {
	if (!canSend()) return;
	ReactGA.event('add_to_cart', params);
}

export function trackBeginCheckout(params: {
	value?: number;
	currency?: string;
	items?: { quantity?: number }[];
}): void {
	if (!canSend()) return;
	ReactGA.event('begin_checkout', params);
}

export function trackPurchase(params: {
	transaction_id: string;
	value: number;
	currency?: string;
	[key: string]: string | number | boolean | undefined;
}): void {
	if (!canSend()) return;
	const safe = sanitizeParams(params);
	if (!safe) return;
	ReactGA.event('purchase', safe);
}

export function trackSignUp(method?: string): void {
	if (!canSend()) return;
	ReactGA.event('sign_up', method ? { method } : {});
}

export function trackLogin(method?: string): void {
	if (!canSend()) return;
	ReactGA.event('login', method ? { method } : {});
}
