import { GroupedSlot, TimeSlot } from '@components/booking';
import { axios } from '@utils';
import { Dayjs } from 'dayjs';

// Constants
export const STORAGE_KEYS = {
	BASKET: 'booking-basket',
	BOOKING: 'booking-data',
};

// API Functions
export const fetchSlots = async (date: Dayjs) => {
	const { data } = await axios.get<TimeSlot[]>('/api/slots', {
		params: {
			from: date.startOf('day').toDate(),
			to: date.endOf('day').toDate(),
		},
	});
	return data;
};

// Local Storage Functions
export const getBasket = (): GroupedSlot[] => {
	const saved = localStorage.getItem(STORAGE_KEYS.BASKET);
	return saved ? JSON.parse(saved) : [];
};

export const saveBasket = (basket: GroupedSlot[]) => {
	localStorage.setItem(STORAGE_KEYS.BASKET, JSON.stringify(basket));
	return basket;
};

export const clearBasket = () => {
	localStorage.removeItem(STORAGE_KEYS.BASKET);
};
