import { describe, it, expect } from 'vitest';
import {
	parseSupportSection,
	supportFaqsHref,
	supportSectionHref,
} from './supportSections';

describe('supportSections', () => {
	it('parses known sections and defaults to faqs', () => {
		expect(parseSupportSection('terms')).toBe('terms');
		expect(parseSupportSection('invalid')).toBe('faqs');
		expect(parseSupportSection(null)).toBe('faqs');
	});

	it('builds section hrefs for the help hub', () => {
		expect(supportSectionHref('faqs')).toBe('/help');
		expect(supportSectionHref('privacy')).toBe('/help?section=privacy');
		expect(supportFaqsHref('membership')).toBe('/help?category=membership');
	});
});
