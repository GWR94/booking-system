import { describe, it, expect } from 'vitest';
import { groupSlotsByBay, getGroupedTimeSlots } from './slots';
import dayjs from 'dayjs';

describe('groupSlotsByBay', () => {
	it('should group slots by bay ID', () => {
		const now = dayjs().startOf('hour');
		const slots = [
			{
				id: 1,
				bayId: 101,
				startTime: now.toDate(),
				endTime: now.add(55, 'minutes').toDate(),
			},
			{
				id: 2,
				bayId: 102,
				startTime: now.toDate(),
				endTime: now.add(55, 'minutes').toDate(),
			},
			{
				id: 3,
				bayId: 101,
				startTime: now.add(1, 'hour').toDate(),
				endTime: now.add(1, 'hour').add(55, 'minutes').toDate(),
			},
		] as any;

		const grouped = groupSlotsByBay(slots);

		expect(grouped).toBeInstanceOf(Array);
		expect(grouped).toHaveLength(2); // Two continuous groups (one for bay 102, one for bay 101 if they are not consecutive)

		// Wait, if bay 101 slots are id 1 and 3. Are they consecutive?
		// id 1 ends at (now + 55m). id 3 starts at (now + 1h).
		// (now + 55m) + 5m = (now + 1h). Yes, they are consecutive!
		// So bay 101 should be 1 group with 2 slots.
		// Bay 102 should be 1 group with 1 slot.
		// Total groups = 2.

		const bay101Group = grouped.find((g) => g.bayId === 101);
		const bay102Group = grouped.find((g) => g.bayId === 102);

		expect(bay101Group).toBeDefined();
		expect(bay101Group!.slotIds).toHaveLength(2);
		expect(bay102Group).toBeDefined();
		expect(bay102Group!.slotIds).toHaveLength(1);
	});

	it('should push final group when at last slot index', () => {
		const now = dayjs().startOf('hour');
		const slots = [
			{
				id: 1,
				bayId: 1,
				startTime: now.toISOString(),
				endTime: now.add(55, 'minutes').toISOString(),
			},
		] as any;
		const grouped = groupSlotsByBay(slots);
		expect(grouped).toHaveLength(1);
		expect(grouped[0].slotIds).toEqual([1]);
	});

	it('should create separate groups when slots are not consecutive', () => {
		const now = dayjs().startOf('hour');
		const slots = [
			{
				id: 1,
				bayId: 1,
				startTime: now.toISOString(),
				endTime: now.add(55, 'minutes').toISOString(),
			},
			{
				id: 2,
				bayId: 1,
				startTime: now.add(2, 'hours').toISOString(),
				endTime: now.add(2, 'hours').add(55, 'minutes').toISOString(),
			},
		] as any;
		const grouped = groupSlotsByBay(slots);
		expect(grouped).toHaveLength(2);
		expect(grouped[0].slotIds).toEqual([1]);
		expect(grouped[1].slotIds).toEqual([2]);
	});
});

describe('getGroupedTimeSlots', () => {
	it('filters by selectedBay when not 5', () => {
		const now = dayjs().startOf('hour');
		const slots = [
			{
				id: 1,
				bayId: 1,
				startTime: now.toISOString(),
				endTime: now.add(55, 'minutes').toISOString(),
			},
			{
				id: 2,
				bayId: 2,
				startTime: now.toISOString(),
				endTime: now.add(55, 'minutes').toISOString(),
			},
		] as any;
		const result = getGroupedTimeSlots(slots, 1, 1, []);
		const keys = Object.keys(result);
		expect(keys.length).toBeGreaterThan(0);
		Object.values(result).forEach((baySlots) => {
			baySlots.forEach((s) => expect(s.bayId).toBe(1));
		});
	});

	it('returns no groups when slots are not consecutive', () => {
		const now = dayjs().startOf('hour');
		const slots = [
			{
				id: 1,
				bayId: 1,
				startTime: now.toISOString(),
				endTime: now.add(55, 'minutes').toISOString(),
			},
			{
				id: 2,
				bayId: 1,
				startTime: now.add(2, 'hours').toISOString(),
				endTime: now.add(2, 'hours').add(55, 'minutes').toISOString(),
			},
		] as any;
		const result = getGroupedTimeSlots(slots, 2, 5, []);
		expect(Object.keys(result)).toHaveLength(0);
	});
});
