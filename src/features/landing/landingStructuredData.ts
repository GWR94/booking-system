import COMPANY_INFO from '@constants/company';
import { normalizeSiteUrl } from '@utils/site-url';

function parseUkAddress(full: string) {
	const parts = full.split(',').map((s) => s.trim());
	const streetAddress = parts.length >= 2 ? `${parts[0]}, ${parts[1]}` : full;
	const tail = parts[parts.length - 1] ?? '';
	const localityMatch = tail.match(/^(.+?)\s+(ME\d{1,2}\s*\d[A-Z]{2})$/i);
	return {
		streetAddress,
		addressLocality: localityMatch?.[1]?.trim() ?? 'Maidstone',
		postalCode: localityMatch?.[2]?.replace(/\s+/, ' ') ?? '',
	};
}

/**
 * Home page JSON-LD: main venue entity (`SportsActivityLocation`).
 */
export function buildLandingSportsActivityLocationJsonLd(baseUrl: string) {
	const site = normalizeSiteUrl(baseUrl);
	const { streetAddress, addressLocality, postalCode } = parseUkAddress(
		COMPANY_INFO.address,
	);

	return {
		'@context': 'https://schema.org',
		'@type': 'SportsActivityLocation',
		name: COMPANY_INFO.name,
		image: `${site}/hero-image.webp`,
		'@id': site,
		url: site,
		telephone: COMPANY_INFO.phone,
		address: {
			'@type': 'PostalAddress',
			streetAddress,
			addressLocality,
			...(postalCode ? { postalCode } : {}),
			addressCountry: 'UK',
		},
		geo: {
			'@type': 'GeoCoordinates',
			latitude: 51.272,
			longitude: 0.529,
		},
		openingHoursSpecification: [
			{
				'@type': 'OpeningHoursSpecification',
				dayOfWeek: [
					'Monday',
					'Tuesday',
					'Wednesday',
					'Thursday',
					'Friday',
					'Saturday',
				],
				opens: '10:00',
				closes: '22:00',
			},
		],
		sameAs: [
			'https://www.facebook.com/theshortgrass',
			'https://www.instagram.com/theshortgrass',
		],
		priceRange: '££',
	};
}
