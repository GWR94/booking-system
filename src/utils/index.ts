// Components
export { ScrollToTop } from './ScrollToTop';

// Slot utilities
export { getGroupedTimeSlots, groupSlotsByBay } from './slots';

// Validation
export { validateInputs } from './validate-input';
export { validateGuestInput } from './validate-guest-input';

// Pricing
export {
	calculateSlotPrice,
	calculateBasketCost,
	isPeakTime,
	PEAK_RATE,
	OFF_PEAK_RATE,
} from './pricing';

// Email: import from '@utils/email' in server code only (uses nodemailer).
// Not re-exported here so client bundle does not pull in nodemailer.

// Logger
export { logger } from './logger';

// Auth (custom JWT tokens – used by /api/user/login and /api/user/refresh)
export { generateTokens } from './tokens';
