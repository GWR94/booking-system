import COMPANY_INFO from '@constants/company';
import { faqData, type FaqItem } from '@constants/memberships';
import { normalizeSiteUrl } from '@utils/site-url';

const HELP_FAQ_CATEGORIES = [
	'booking',
	'payment',
	'facilities',
	'account',
	'membership',
] as const;

export const HELP_PAGE_DESCRIPTION =
	'Help, FAQs, terms, privacy, and cookie settings for The Short Grass indoor golf in Maidstone.';

function collectHelpFaqs(): FaqItem[] {
	return HELP_FAQ_CATEGORIES.flatMap((category) => faqData[category] ?? []);
}

function buildHelpFaqEntities() {
	return collectHelpFaqs().map((item) => ({
		'@type': 'Question',
		name: item.question,
		acceptedAnswer: {
			'@type': 'Answer',
			text: item.answer,
		},
	}));
}

/**
 * Help center JSON-LD: page shell (`WebPage`) plus on-page FAQs (`FAQPage`).
 * Venue entity stays on `/` — referenced via `about.@id` only.
 */
export function buildHelpCenterPageJsonLd(baseUrl: string) {
	const site = normalizeSiteUrl(baseUrl);
	const pageUrl = `${site}/help`;

	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebPage',
				'@id': `${pageUrl}#webpage`,
				url: pageUrl,
				name: 'Help & policies | The Short Grass',
				description: HELP_PAGE_DESCRIPTION,
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
				mainEntity: { '@id': `${pageUrl}#faq` },
			},
			{
				'@type': 'FAQPage',
				'@id': `${pageUrl}#faq`,
				url: pageUrl,
				mainEntity: buildHelpFaqEntities(),
			},
		],
	};
}
