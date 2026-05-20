import { describe, it, expect } from 'vitest';
import { buildLandingSportsActivityLocationJsonLd } from './landingStructuredData';

describe('buildLandingSportsActivityLocationJsonLd', () => {
	it('uses site origin for @id, url, and hero image', () => {
		const data = buildLandingSportsActivityLocationJsonLd(
			'https://example.com/',
		) as {
			'@id': string;
			url: string;
			image: string;
			telephone: string;
		};

		expect(data['@id']).toBe('https://example.com');
		expect(data.url).toBe('https://example.com');
		expect(data.image).toBe('https://example.com/hero-image.webp');
		expect(data.telephone).toMatch(/^\+/);
	});

	it('strips a trailing slash from the base URL', () => {
		const data = buildLandingSportsActivityLocationJsonLd(
			'https://example.com/',
		) as { '@id': string };
		expect(data['@id']).toBe('https://example.com');
	});
});
