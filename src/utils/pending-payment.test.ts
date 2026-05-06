import { describe, expect, it } from 'vitest';
import dayjs from 'dayjs';
import {
	getLatestResumablePendingBooking,
	isResumablePendingBooking,
} from './pending-payment';

describe('pending payment helpers', () => {
	it('detects resumable pending booking', () => {
		expect(
			isResumablePendingBooking({
				id: 1,
				status: 'pending',
				paymentId: 'pi_test',
				slots: [{ endTime: dayjs().add(2, 'hour').toISOString() }],
			}),
		).toBe(true);
	});

	it('returns latest resumable booking only', () => {
		const first = {
			id: 1,
			status: 'pending',
			paymentId: 'pi_1',
			bookingTime: dayjs().subtract(2, 'hour').toISOString(),
			slots: [{ endTime: dayjs().add(1, 'hour').toISOString() }],
		};
		const second = {
			id: 2,
			status: 'pending',
			paymentId: 'pi_2',
			bookingTime: dayjs().toISOString(),
			slots: [{ endTime: dayjs().add(2, 'hour').toISOString() }],
		};
		const expired = {
			id: 3,
			status: 'pending',
			paymentId: 'pi_3',
			bookingTime: dayjs().add(1, 'hour').toISOString(),
			slots: [{ endTime: dayjs().subtract(1, 'hour').toISOString() }],
		};

		expect(getLatestResumablePendingBooking([first, second, expired])?.id).toBe(2);
	});
});

