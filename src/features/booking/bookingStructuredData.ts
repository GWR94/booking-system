import { normalizeSiteUrl } from '@utils/site-url';

export const BOOK_PAGE_DESCRIPTION =
	'Book your indoor golf session at The Short Grass.';

/**
 * Book flow: page is a reservation entry point for the venue (`ReserveAction`).
 */
export function buildBookPageJsonLd(baseUrl: string) {
	const site = normalizeSiteUrl(baseUrl);
	const bookUrl = `${site}/book`;

	return {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': `${bookUrl}#webpage`,
		url: bookUrl,
		name: 'Book a Session | The Short Grass',
		description: BOOK_PAGE_DESCRIPTION,
		isPartOf: {
			'@type': 'WebSite',
			url: `${site}/`,
			name: 'The Short Grass',
		},
		about: {
			'@type': 'SportsActivityLocation',
			'@id': site,
			name: 'The Short Grass',
		},
		potentialAction: {
			'@type': 'ReserveAction',
			target: {
				'@type': 'EntryPoint',
				urlTemplate: bookUrl,
				actionPlatform: [
					'http://schema.org/DesktopWebPlatform',
					'http://schema.org/MobileWebPlatform',
				],
			},
		},
	};
}
