import COMPANY_INFO from '@constants/company';
import { normalizeSiteUrl } from '@utils/site-url';

export const CHECKOUT_PAGE_DESCRIPTION =
	'Complete your booking securely at The Short Grass.';

export const CHECKOUT_COMPLETE_PAGE_DESCRIPTION =
	'Your booking has been confirmed at The Short Grass.';

export function buildCheckoutPageJsonLd(baseUrl: string) {
	const site = normalizeSiteUrl(baseUrl);
	const url = `${site}/checkout`;

	return {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': `${url}#webpage`,
		url,
		name: 'Checkout | The Short Grass',
		description: CHECKOUT_PAGE_DESCRIPTION,
		isPartOf: {
			'@type': 'WebSite',
			url: `${site}/`,
			name: COMPANY_INFO.name,
		},
		about: {
			'@type': 'SportsActivityLocation',
			'@id': site,
			name: COMPANY_INFO.name,
		},
	};
}

export function buildCheckoutCompletePageJsonLd(baseUrl: string) {
	const site = normalizeSiteUrl(baseUrl);
	const url = `${site}/checkout/complete`;

	return {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': `${url}#webpage`,
		url,
		name: 'Booking Confirmed | The Short Grass',
		description: CHECKOUT_COMPLETE_PAGE_DESCRIPTION,
		isPartOf: {
			'@type': 'WebSite',
			url: `${site}/`,
			name: COMPANY_INFO.name,
		},
		about: {
			'@type': 'SportsActivityLocation',
			'@id': site,
			name: COMPANY_INFO.name,
		},
	};
}
