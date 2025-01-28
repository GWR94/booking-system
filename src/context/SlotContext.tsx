import React, {
	createContext,
	useState,
	useContext,
	useEffect,
	useMemo,
} from 'react';
import axios from '../utils/axiosConfig';
import dayjs, { Dayjs } from 'dayjs';
import { SessionTimes } from '../pages/Booking';
import {
	SlotsContextType,
	SlotsProviderProps,
	TimeSlot,
	Bays,
	GroupedTimeSlots,
} from '../components/interfaces/SlotContext.i';

/**
 * TODO
 * [ ] Refactor getGroupedTimeSlots function to be more legible
 */

const SlotsContext = createContext<SlotsContextType | null>(null);

export const SlotsProvider: React.FC<SlotsProviderProps> = ({ children }) => {
	const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
	const [isLoading, setLoading] = useState(true);
	const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
	const [selectedSession, setSelectedSession] = useState<SessionTimes>(1);
	const [selectedBay, setSelectedBay] = useState<Bays>(5);

	const getGroupedTimeSlots = (
		slots: TimeSlot[],
		sessionDuration = 1,
		selectedBay = 5,
	): GroupedTimeSlots => {
		// Filter and sort slots
		const sortedSlots = slots
			// if selectedBay is 5 then it will show all bays, so no need to filter
			.filter((slot) => (selectedBay !== 5 ? slot.bayId === selectedBay : true))
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
							// add 5 minutes to the end time so that they can be matched for hourly slots
							dayjs(consecutiveSlots[index - 1].endTime).add(5, 'minutes'),
						),
				);

				if (isConsecutive) {
					const startTime = dayjs(consecutiveSlots[0].startTime);
					const endTime = dayjs(consecutiveSlots[sessionDuration - 1].endTime);
					const key = `${startTime.format('HH:mm')}-${endTime.format('HH:mm')}`;

					if (!groupedSlots[key]) {
						groupedSlots[key] = [];
					}

					groupedSlots[key].push({
						id: consecutiveSlots[0].id,
						startTime,
						endTime,
						bayId: parseInt(bayId),
						slotIds: consecutiveSlots.map((slot) => slot.id),
					});
				}
			}
		});

		return groupedSlots;
	};

	const groupedTimeSlots = useMemo(
		() => getGroupedTimeSlots(timeSlots, selectedSession, selectedBay),
		[timeSlots, selectedSession, selectedBay],
	);

	useEffect(() => {
		// Fetch available slots for the selected date (current date as default)
		const getAvailableSlots = async () => {
			try {
				const { data } = await axios.get(`/api/slots`, {
					params: {
						from: dayjs(selectedDate).startOf('day').toDate(),
						to: dayjs(selectedDate).endOf('day').toDate(),
					},
				});
				setTimeSlots(data);
				setTimeout(() => {
					setLoading(false);
				}, 1000);
			} catch (err) {
				console.error(err);
			}
		};
		getAvailableSlots();
	}, [selectedDate]);

	const value: SlotsContextType = {
		selectedDate,
		selectedSession,
		selectedBay,
		setSelectedDate: (date: Dayjs) => setSelectedDate(date),
		setSelectedSession: (session: SessionTimes) => setSelectedSession(session),
		setSelectedBay: (bay: Bays) => setSelectedBay(bay),
		isLoading,
		groupedTimeSlots,
	};
	return (
		<SlotsContext.Provider value={value}>{children}</SlotsContext.Provider>
	);
};

export const useSlots = (): SlotsContextType => {
	const context = useContext(SlotsContext);
	if (!context) {
		throw new Error('useSlots most be used within a SlotsProvider');
	}
	return context;
};
