import dayjs from 'dayjs';
import { TimeSlot, GroupedTimeSlots, GroupedSlot } from '@components/booking';

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
				const key = `${startTime.format('HH:mm')}-${endTime.format('HH:mm')}`;
				const slotIds = consecutiveSlots.map((slot) => slot.id);

				// Check if this slot is in the basket
				const inBasket = slotIds.some((id) => basketSlotIds.includes(id));

				if (!groupedSlots[key]) {
					groupedSlots[key] = [];
				}

				groupedSlots[key].push({
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
