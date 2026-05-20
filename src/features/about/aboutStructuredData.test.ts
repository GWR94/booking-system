import { describe, it, expect } from 'vitest';
import { buildAboutPageJsonLd } from './aboutStructuredData';

describe('buildAboutPageJsonLd', () => {
	it('emits AboutPage JSON-LD tied to the venue entity', () => {
		const data = buildAboutPageJsonLd('https://example.com/');

		expect(data['@context']).toBe('https://schema.org');
		expect(data['@type']).toBe('AboutPage');
		expect(data['@id']).toBe('https://example.com/about#webpage');
		expect(data.url).toBe('https://example.com/about');
		expect((data as { about: { '@id': string } }).about['@id']).toBe(
			'https://example.com',
		);
	});

	it('normalizes a trailing slash on the base URL', () => {
		const data = buildAboutPageJsonLd('https://example.com/');
		expect((data as { about: { '@id': string } }).about['@id']).toBe(
			'https://example.com',
		);
	});
});
