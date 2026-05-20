import { describe, it, expect } from 'vitest';
import { buildMembershipPageJsonLd } from './membershipStructuredData';

describe('buildMembershipPageJsonLd', () => {
	it('returns a graph with WebPage and ItemList only', () => {
		const data = buildMembershipPageJsonLd('https://example.com/') as {
			'@graph': { '@type': string }[];
		};

		const types = data['@graph'].map((n) => n['@type']).sort();
		expect(types).toEqual(['ItemList', 'WebPage']);
	});

	it('lists three membership products', () => {
		const data = buildMembershipPageJsonLd('https://example.com/') as {
			'@graph': Array<{ '@type': string; itemListElement?: unknown[] }>;
		};
		const list = data['@graph'].find((n) => n['@type'] === 'ItemList');
		expect(list?.itemListElement).toHaveLength(3);
	});
});
