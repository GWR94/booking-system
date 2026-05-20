import COMPANY_INFO from '@constants/company';
import { MEMBERSHIP_TIER_ORDER, MEMBERSHIP_TIERS } from '@constants/memberships';
import { normalizeSiteUrl } from '@utils/site-url';

export const MEMBERSHIP_PAGE_DESCRIPTION =
	'Explore membership plans and choose the best option for your game.';

function gbpPriceFromPence(amountPence: number): string {
	return (amountPence / 100).toFixed(2);
}

function buildMembershipItemList(site: string) {
	return {
		'@type': 'ItemList',
		'@id': `${site}/membership#plans`,
		numberOfItems: MEMBERSHIP_TIER_ORDER.length,
		itemListElement: MEMBERSHIP_TIER_ORDER.map((tierKey, index) => {
			const tier = MEMBERSHIP_TIERS[tierKey];
			const description = tier.features.join(' ');
			return {
				'@type': 'ListItem',
				position: index + 1,
				item: {
					'@type': 'Product',
					name: `${tier.title} membership`,
					description,
					brand: {
						'@type': 'Brand',
						name: COMPANY_INFO.name,
					},
					offers: {
						'@type': 'Offer',
						url: `${site}/membership`,
						priceCurrency: 'GBP',
						price: gbpPriceFromPence(tier.amountPence),
						availability: 'https://schema.org/InStock',
						category: 'Subscription',
					},
				},
			};
		}),
	};
}

/**
 * Membership marketing URL: plan list (`ItemList` + `Product`/`Offer`).
 * Membership FAQs live on `/help` (see `buildHelpCenterPageJsonLd`).
 */
export function buildMembershipPageJsonLd(baseUrl: string) {
	const site = normalizeSiteUrl(baseUrl);
	const pageUrl = `${site}/membership`;

	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebPage',
				'@id': `${pageUrl}#webpage`,
				url: pageUrl,
				name: 'Membership | The Short Grass',
				description: MEMBERSHIP_PAGE_DESCRIPTION,
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
				mainEntity: { '@id': `${site}/membership#plans` },
			},
			buildMembershipItemList(site),
		],
	};
}
