import { describe, it, expect } from 'vitest';
import { buildBookPageJsonLd } from './bookingStructuredData';

describe('buildBookPageJsonLd', () => {
	it('includes ReserveAction targeting the book URL', () => {
		const data = buildBookPageJsonLd('https://example.com/') as {
			potentialAction: { target: { urlTemplate: string } };
			url: string;
		};

		expect(data.url).toBe('https://example.com/book');
		expect(data.potentialAction.target.urlTemplate).toBe(
			'https://example.com/book',
		);
	});
});
