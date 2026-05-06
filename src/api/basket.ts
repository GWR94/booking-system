import { GroupedSlot, TimeSlot } from '@features/booking/components';
import { axios } from '@api/client';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

export const STORAGE_KEYS = {
	BASKET: 'booking-basket',
	BOOKING: 'booking-data',
};

export const fetchSlots = async (date: Dayjs) => {
	const { data } = await axios.get<TimeSlot[]>('/api/slots', {
		params: {
			from: date.startOf('day').toDate(),
			to: date.endOf('day').toDate(),
		},
	});
	return data;
};

function parseBasket(raw: unknown): GroupedSlot[] {
	if (!Array.isArray(raw)) return [];
	return raw.map((item: any) => ({
		...item,
		startTime: dayjs(item.startTime),
		endTime: dayjs(item.endTime),
	}));
}

export const getBasket = (): GroupedSlot[] => {
	if (typeof window === 'undefined') return [];
	const saved = localStorage.getItem(STORAGE_KEYS.BASKET);
	return saved ? parseBasket(JSON.parse(saved)) : [];
};

export const saveBasket = (basket: GroupedSlot[]) => {
	if (typeof window === 'undefined') return basket;
	localStorage.setItem(STORAGE_KEYS.BASKET, JSON.stringify(basket));
	return basket;
};

export const clearBasket = () => {
	if (typeof window === 'undefined') return;
	localStorage.removeItem(STORAGE_KEYS.BASKET);
};
