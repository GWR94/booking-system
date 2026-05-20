import { normalizeSiteUrl } from '@utils/site-url';

/**
 * JSON-LD for `/about` (Schema.org `AboutPage`).
 *
 * - **`AboutPage`**: tells search engines this URL is specifically an “about us” page.
 * - **`isPartOf` → `WebSite`**: ties the page to your site as a whole.
 * - **`about` → `SportsActivityLocation`**: the real-world thing the copy is about (your venue).
 *   Use the same `@id` and canonical `url` as on the home page `SportsActivityLocation` so both
 *   pages describe one entity instead of inventing a duplicate venue.
 */
export const ABOUT_PAGE_DESCRIPTION =
	'Learn about The Short Grass — Maidstone’s indoor golf venue, our TrackMan bays, lounge, team, and the story behind the space.';

export function buildAboutPageJsonLd(baseUrl: string) {
	const site = normalizeSiteUrl(baseUrl);

	return {
		'@context': 'https://schema.org',
		'@type': 'AboutPage',
		'@id': `${site}/about#webpage`,
		url: `${site}/about`,
		name: 'About | The Short Grass',
		description: ABOUT_PAGE_DESCRIPTION,
		isPartOf: {
			'@type': 'WebSite',
			url: `${site}/`,
			name: 'The Short Grass',
		},
		about: {
			'@type': 'SportsActivityLocation',
			'@id': site,
			name: 'The Short Grass',
			url: site,
		},
	};
}
