import dayjs from 'dayjs';
import {
	TimeSlot,
	GroupedTimeSlots,
	GroupedSlot,
} from '../features/booking/components';

/**
 * Groups time slots into available booking windows based on session duration and bay selection
 *
 * This function:
 * - Filters slots by selected bay (bay 5 = all bays)
 * - Finds consecutive time slots that match the session duration
 * - Groups available slots by time range
 * - Marks slots that are already in the basket
 *
 * @param slots - Array of available time slots
 * @param sessionDuration - Number of consecutive hours needed (default: 1)
 * @param selectedBay - Bay number to filter (5 = show all bays)
 * @param basket - Current basket contents to mark slots as unavailable
 * @returns Object with time ranges as keys and available bay slots as values
 * @example
 * const grouped = getGroupedTimeSlots(slots, 2, 1, basket);
 * // Returns: {
 * //   "10:00-12:00": [{ bayId: 1, slotIds: [1, 2], inBasket: false }],
 * //   "14:00-16:00": [{ bayId: 1, slotIds: [3, 4], inBasket: true }]
 * // }
 */
export const getGroupedTimeSlots = (
	slots: TimeSlot[],
	sessionDuration = 1,
	selectedBay = 5,
	basket: GroupedSlot[] = [],
): GroupedTimeSlots => {
	const basketSlotIds = basket.flatMap((item) => item.slotIds);

	// Filter and sort slots
	const sortedSlots = slots
		// filter out slots that are already in the basket [paused]
		// .filter((slot) => !basketSlotIds.includes(slot.id))
		// filter out slots that are in the past [paused for now]
		// .filter((slot) => dayjs(slot.startTime).isAfter(dayjs()))
		// if selectedBay is 5 then it will show all bays, so no need to filter
		.filter((slot) => (selectedBay !== 5 ? slot.bayId === selectedBay : true))
		// .filter((slot) => basket.includes(slot.id))
		.sort(
			(a, b) => dayjs(a.startTime).valueOf() - dayjs(b.startTime).valueOf(),
		);

	const groupedSlots: GroupedTimeSlots = {};
	const slotsByBay: { [bayId: number]: TimeSlot[] } = {};

	// Group slots by bay
	sortedSlots.forEach((slot) => {
		if (!slotsByBay[slot.bayId]) {
			slotsByBay[slot.bayId] = [];
		}
		slotsByBay[slot.bayId].push(slot);
	});

	// Process each bay's slots
	Object.entries(slotsByBay).forEach(([bayId, baySlots]) => {
		for (let i = 0; i <= baySlots.length - sessionDuration; i++) {
			const consecutiveSlots = baySlots.slice(i, i + sessionDuration);

			// Validate consecutive slots
			const isConsecutive = consecutiveSlots.every(
				(slot, index) =>
					index === 0 ||
					dayjs(slot.startTime).isSame(
						dayjs(consecutiveSlots[index - 1].endTime).add(5, 'minutes'),
					),
			);

			if (isConsecutive) {
				const startTime = dayjs(consecutiveSlots[0].startTime);
				const endTime = dayjs(consecutiveSlots[sessionDuration - 1].endTime);
				const timeRange = `${startTime.format('HH:mm')}-${endTime.format('HH:mm')}`;
				const slotIds = consecutiveSlots.map((slot) => slot.id);

				// Check if this slot is in the basket
				const inBasket = slotIds.some((id) => basketSlotIds.includes(id));

				if (!groupedSlots[timeRange]) {
					groupedSlots[timeRange] = [];
				}

				groupedSlots[timeRange].push({
					id: consecutiveSlots[0].id,
					startTime,
					endTime,
					bayId: parseInt(bayId),
					slotIds,
					inBasket,
				});
			}
		}
	});
	return groupedSlots;
};

/**
 * Groups consecutive time slots by bay for booking confirmation and display
 *
 * Takes a flat array of time slots and groups consecutive slots together
 * (slots where end time + 5 minutes = next start time) by bay.
 * Useful for displaying booked sessions and calculating totals.
 *
 * @param slots - Array of time slots to group
 * @returns Array of grouped slots with combined start/end times and slot IDs
 * @example
 * const slots = [
 *   { id: 1, bayId: 1, startTime: '10:00', endTime: '11:00' },
 *   { id: 2, bayId: 1, startTime: '11:05', endTime: '12:05' },
 *   { id: 3, bayId: 2, startTime: '10:00', endTime: '11:00' }
 * ];
 * groupSlotsByBay(slots);
 * // Returns: [
 * //   { id: 1, bayId: 1, startTime: dayjs('10:00'), endTime: dayjs('12:05'), slotIds: [1, 2] },
 * //   { id: 3, bayId: 2, startTime: dayjs('10:00'), endTime: dayjs('11:00'), slotIds: [3] }
 * // ]
 */
export const groupSlotsByBay = (slots: TimeSlot[]): GroupedSlot[] => {
	if (!slots || slots.length === 0) return [];

	const grouped: GroupedSlot[] = [];
	const sortedSlots = [...slots].sort(
		(a, b) => dayjs(a.startTime).valueOf() - dayjs(b.startTime).valueOf(),
	);

	const bayGroups: { [key: number]: TimeSlot[] } = {};
	sortedSlots.forEach((slot) => {
		if (!bayGroups[slot.bayId]) {
			bayGroups[slot.bayId] = [];
		}
		bayGroups[slot.bayId].push(slot);
	});

	Object.values(bayGroups).forEach((baySlots) => {
		let currentGroup: TimeSlot[] = [];

		baySlots.forEach((slot, index) => {
			if (index === 0) {
				currentGroup = [slot];
			} else {
				const prevSlot = baySlots[index - 1];
				const isConsecutive = dayjs(slot.startTime).isSame(
					dayjs(prevSlot.endTime).add(5, 'minutes'),
				);

				if (isConsecutive) {
					currentGroup.push(slot);
				} else {
					grouped.push({
						id: currentGroup[0].id,
						startTime: dayjs(currentGroup[0].startTime),
						endTime: dayjs(currentGroup[currentGroup.length - 1].endTime),
						bayId: currentGroup[0].bayId,
						slotIds: currentGroup.map((s) => s.id),
					});
					currentGroup = [slot];
				}
			}

			if (index === baySlots.length - 1) {
				grouped.push({
					id: currentGroup[0].id,
					startTime: dayjs(currentGroup[0].startTime),
					endTime: dayjs(currentGroup[currentGroup.length - 1].endTime),
					bayId: currentGroup[0].bayId,
					slotIds: currentGroup.map((s) => s.id),
				});
			}
		});
	});

	return grouped;
};
