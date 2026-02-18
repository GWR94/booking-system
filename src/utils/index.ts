export { ScrollToTop } from './ScrollToTop';

export { getGroupedTimeSlots, groupSlotsByBay } from './slots';

export { validateInputs } from './validate-input';
export { validateGuestInput } from './validate-guest-input';

export {
	calculateSlotPrice,
	calculateBasketCost,
	isPeakTime,
	PEAK_RATE,
	OFF_PEAK_RATE,
} from './pricing';

// Email: import from '@utils/email' in server code only (uses nodemailer).
// Not re-exported here so client bundle does not pull in nodemailer.

export { logger } from './logger';
