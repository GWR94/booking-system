import dayjs from 'dayjs';

export const PEAK_RATE = 4500; // £45
export const OFF_PEAK_RATE = 3500; // £35

export const isPeakTime = (date: Date | string | dayjs.Dayjs): boolean => {
	const d = dayjs(date);
	const dayOfWeek = d.day(); // 0 = Sunday, 6 = Saturday
	const hour = d.hour();

	const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
	const isPeakHour = hour >= 17; // 5 PM or later

	return isWeekend || isPeakHour;
};

export const getDiscountPercentage = (tier?: string): number => {
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
