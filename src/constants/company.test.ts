import { describe, it, expect } from 'vitest';
import COMPANY_INFO, {
	companyAddressLines,
	companyAddressMultiline,
} from './company';

describe('company address formatting', () => {
	it('splits address into lines at commas', () => {
		expect(companyAddressLines).toEqual([
			'Royal Star Arcade',
			'High St',
			'Maidstone',
			'ME14 1JL',
		]);
	});

	it('joins lines with newlines for pre-line display', () => {
		expect(companyAddressMultiline).toBe(
			'Royal Star Arcade\nHigh St\nMaidstone\nME14 1JL',
		);
		expect(companyAddressMultiline).not.toBe(COMPANY_INFO.address);
	});
});
