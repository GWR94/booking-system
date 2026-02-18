import { describe, it, expect } from 'vitest';
import {
	isPeakTime,
	calculateSlotPrice,
	PEAK_RATE,
	OFF_PEAK_RATE,
} from './pricing';
import dayjs from 'dayjs';

describe('pricing utilities', () => {
	describe('isPeakTime', () => {
		it('should return true for weekends', () => {
			const saturday = dayjs('2024-01-20T10:00:00Z'); // Saturday
			const sunday = dayjs('2024-01-21T10:00:00Z'); // Sunday
			expect(isPeakTime(saturday)).toBe(true);
			expect(isPeakTime(sunday)).toBe(true);
		});

		it('should return true for weekday evenings (>= 5 PM)', () => {
			const mondayEvening = dayjs('2024-01-22T17:00:00Z'); // Monday 5 PM
			const fridayEvening = dayjs('2024-01-26T22:00:00Z'); // Friday 10 PM
			expect(isPeakTime(mondayEvening)).toBe(true);
			expect(isPeakTime(fridayEvening)).toBe(true);
		});

		it('should return false for weekday mornings (< 5 PM)', () => {
			const mondayMorning = dayjs('2024-01-22T10:00:00Z'); // Monday 10 AM
			const fridayAfternoon = dayjs('2024-01-26T16:59:59Z'); // Friday 4:59 PM
			expect(isPeakTime(mondayMorning)).toBe(false);
			expect(isPeakTime(fridayAfternoon)).toBe(false);
		});
	});

	describe('calculateSlotPrice', () => {
		const peakPrice = PEAK_RATE / 100;
		const offPeakPrice = OFF_PEAK_RATE / 100;

		it('should calculate peak price for non-members', () => {
			const result = calculateSlotPrice('2024-01-20T10:00:00Z', 'NONE', false);
			expect(result.originalPrice).toBe(peakPrice);
			expect(result.discountedPrice).toBe(peakPrice);
			expect(result.hasDiscount).toBe(false);
		});

		it('should calculate off-peak price for non-members', () => {
			const result = calculateSlotPrice('2024-01-22T10:00:00Z', 'NONE', false);
			expect(result.originalPrice).toBe(offPeakPrice);
			expect(result.discountedPrice).toBe(offPeakPrice);
			expect(result.hasDiscount).toBe(false);
		});

		it('should apply PAR discount (10%) to peak price', () => {
			const result = calculateSlotPrice('2024-01-20T10:00:00Z', 'PAR', true);
			expect(result.originalPrice).toBe(peakPrice);
			expect(result.discountedPrice).toBe(peakPrice * 0.9);
			expect(result.hasDiscount).toBe(true);
		});

		it('should apply HOLEINONE discount (20%) to off-peak price', () => {
			const result = calculateSlotPrice(
				'2024-01-22T10:00:00Z',
				'HOLEINONE',
				true,
			);
			expect(result.originalPrice).toBe(offPeakPrice);
			expect(result.discountedPrice).toBe(offPeakPrice * 0.8);
			expect(result.hasDiscount).toBe(true);
		});

		it('should apply no discount for unknown tier (default branch)', () => {
			const result = calculateSlotPrice(
				'2024-01-22T10:00:00Z',
				'UNKNOWN' as any,
				true,
			);
			expect(result.hasDiscount).toBe(false);
			expect(result.discountedPrice).toBe(result.originalPrice);
		});
	});
});
