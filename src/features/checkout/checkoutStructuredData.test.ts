import { describe, it, expect } from 'vitest';
import {
	buildCheckoutCompletePageJsonLd,
	buildCheckoutPageJsonLd,
} from './checkoutStructuredData';

describe('checkout structured data', () => {
	it('buildCheckoutPageJsonLd targets checkout path', () => {
		const data = buildCheckoutPageJsonLd('https://example.com/') as {
			url: string;
		};
		expect(data.url).toBe('https://example.com/checkout');
	});

	it('buildCheckoutCompletePageJsonLd targets complete path', () => {
		const data = buildCheckoutCompletePageJsonLd('https://example.com/') as {
			url: string;
		};
		expect(data.url).toBe('https://example.com/checkout/complete');
	});
});
