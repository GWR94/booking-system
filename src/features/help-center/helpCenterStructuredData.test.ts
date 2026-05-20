import { describe, it, expect } from 'vitest';
import { buildHelpCenterPageJsonLd } from './helpCenterStructuredData';

describe('buildHelpCenterPageJsonLd', () => {
	it('returns a graph with WebPage and FAQPage for /help', () => {
		const data = buildHelpCenterPageJsonLd('https://example.com/') as {
			'@graph': { '@type': string; '@id'?: string }[];
		};

		const types = data['@graph'].map((n) => n['@type']).sort();
		expect(types).toEqual(['FAQPage', 'WebPage']);

		const webpage = data['@graph'].find((n) => n['@type'] === 'WebPage');
		expect(webpage?.['@id']).toBe('https://example.com/help#webpage');

		const faqPage = data['@graph'].find((n) => n['@type'] === 'FAQPage');
		expect(faqPage?.['@id']).toBe('https://example.com/help#faq');
	});

	it('includes all FAQ categories from the help hub', () => {
		const data = buildHelpCenterPageJsonLd('https://example.com/') as {
			'@graph': Array<{
				'@type': string;
				mainEntity?: Array<{ name: string }>;
			}>;
		};
		const faqPage = data['@graph'].find((n) => n['@type'] === 'FAQPage');
		const questions = faqPage?.mainEntity?.map((q) => q.name) ?? [];

		expect(questions.length).toBeGreaterThan(0);
		expect(
			questions.some((q) => q.toLowerCase().includes('membership')),
		).toBe(true);
	});
});
