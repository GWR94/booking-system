import dayjs from 'dayjs';

/** Hourly rate for peak times in pence (£45.00) */
export const PEAK_RATE = 4500;

/** Hourly rate for off-peak times in pence (£35.00) */
export const OFF_PEAK_RATE = 3500;

/**
 * Determines if a given time is during peak hours
 *
 * Peak hours are defined as:
 * - All day Saturday and Sunday (weekends)
 * - Weekdays after 5 PM (17:00)
 *
 * @param date - The date/time to check
 * @returns True if peak time, false if off-peak
 * @example
 * isPeakTime(new Date('2024-01-15 18:00')); // true (weekday after 5pm)
 * isPeakTime(new Date('2024-01-15 14:00')); // false (weekday before 5pm)
 * isPeakTime(new Date('2024-01-20 10:00')); // true (Saturday)
 */
export const isPeakTime = (date: Date | string | dayjs.Dayjs): boolean => {
	const d = dayjs(date);
	const dayOfWeek = d.day(); // 0 = Sunday, 6 = Saturday
	const hour = d.hour();

	const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
	const isPeakHour = hour >= 17; // 5 PM or later

	return isWeekend || isPeakHour;
};

/**
 * Gets the discount percentage for a membership tier
 *
 * @param tier - Membership tier name (case-insensitive)
 * @returns Discount percentage (0-20)
 * @internal
 */
const getDiscountPercentage = (tier?: string): number => {
	switch (tier?.toUpperCase()) {
		case 'PAR':
			return 10;
		case 'BIRDIE':
			return 15;
		case 'HOLEINONE':
			return 20;
		default:
			return 0;
	}
};

/**
 * Calculates the price for a time slot with membership discounts applied
 *
 * @param startTime - Start time of the slot
 * @param tier - Membership tier (PAR=10% off, BIRDIE=15% off, HOLEINONE=20% off)
 * @param isActive - Whether the membership is currently active
 * @returns Object containing original price, discounted price, and discount status
 * @example
 * // Peak time with active Birdie membership
 * calculateSlotPrice(new Date('2024-01-15 18:00'), 'BIRDIE', true);
 * // Returns: { originalPrice: 45, discountedPrice: 38.25, hasDiscount: true }
 *
 * @example
 * // Off-peak time without membership
 * calculateSlotPrice(new Date('2024-01-15 14:00'));
 * // Returns: { originalPrice: 35, discountedPrice: 35, hasDiscount: false }
 */
export const calculateSlotPrice = (
	startTime: Date | string | dayjs.Dayjs,
	tier?: string,
	isActive?: boolean,
): { originalPrice: number; discountedPrice: number; hasDiscount: boolean } => {
	const baseRate = isPeakTime(startTime) ? PEAK_RATE : OFF_PEAK_RATE;
	const originalPrice = baseRate / 100;
	const discountPercentage = isActive ? getDiscountPercentage(tier) : 0;
	const hasDiscount = discountPercentage > 0;
	const discountedPrice = hasDiscount
		? originalPrice * (1 - discountPercentage / 100)
		: originalPrice;

	return {
		originalPrice,
		discountedPrice,
		hasDiscount,
	};
};

/**
 * Configuration options for basket cost calculation
 */
interface CalculationOptions {
	/** Membership tier configuration */
	tierConfig?: {
		/** Discount as a decimal (e.g., 0.15 for 15% off) */
		discount: number;
		/** Number of hours included in the membership */
		includedHours: number;
		/** Whether tier includes weekend access */
		weekendAccess: boolean;
	};
	/** Number of included hours remaining this month */
	remainingIncludedHours?: number;
}

/**
 * Calculates the total cost for a basket of time slots with membership benefits applied
 *
 * Applies membership benefits in this order:
 * 1. Uses remaining included hours (if eligible based on day of week)
 * 2. Applies tier discount to remaining slots
 * 3. Uses peak/off-peak rates as base price
 *
 * @param slots - Array of time slots with startTime
 * @param options - Calculation options including tier config and remaining hours
 * @returns Total cost in pence, rounded to nearest whole number
 * @example
 * // Calculate cost with membership benefits
 * const slots = [
 *   { startTime: new Date('2024-01-15 18:00') },
 *   { startTime: new Date('2024-01-15 19:00') }
 * ];
 * calculateBasketCost(slots, {
 *   tierConfig: { discount: 0.15, includedHours: 10, weekendAccess: true },
 *   remainingIncludedHours: 2
 * });
 * // First 2 slots free, returns 0
 *
 * @example
 * // Calculate cost without membership
 * calculateBasketCost([{ startTime: new Date('2024-01-15 14:00') }]);
 * // Returns: 3500 (off-peak rate)
 */
export const calculateBasketCost = (
	slots: { startTime: Date | string }[],
	options?: CalculationOptions,
) => {
	const { tierConfig, remainingIncludedHours = 0 } = options || {};
	let currentRemaining = remainingIncludedHours;

	const total = slots.reduce((acc: number, slot: any) => {
		const isPeak = isPeakTime(slot.startTime);
		const rate = isPeak ? PEAK_RATE : OFF_PEAK_RATE;

		if (tierConfig) {
			const slotTime = dayjs(slot.startTime);
			const dayOfWeek = slotTime.day(); // 0 = Sunday, 6 = Saturday
			const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
			const isEligibleForFree = tierConfig.weekendAccess || !isWeekend;

			if (isEligibleForFree && currentRemaining > 0) {
				currentRemaining--;
				return acc;
			}

			return acc + rate * (1 - tierConfig.discount);
		}

		return acc + rate;
	}, 0);

	return Math.round(total);
};
