import { describe, it, expect, vi, beforeEach } from 'vitest';
import { axios } from '@api/client';
import dayjs from 'dayjs';
import {
	fetchSlots,
	getBasket,
	saveBasket,
	clearBasket,
	STORAGE_KEYS,
} from './basket';

vi.mock('@api/client', () => ({
	axios: {
		get: vi.fn(),
	},
}));

describe('basket api', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		localStorage.clear();
	});

	it('fetchSlots should call GET /api/slots with proper params', async () => {
		const date = dayjs('2023-01-01');
		const mockSlots = [{ id: 1 }];
		(axios.get as any).mockResolvedValue({ data: mockSlots });

		const result = await fetchSlots(date);

		expect(axios.get).toHaveBeenCalledWith('/api/slots', {
			params: {
				from: date.startOf('day').toDate(),
				to: date.endOf('day').toDate(),
			},
		});
		expect(result).toEqual(mockSlots);
	});

	it('getBasket should return empty array if nothing in localStorage', () => {
		const result = getBasket();
		expect(result).toEqual([]);
	});

	it('getBasket should return parsed data from localStorage with dayjs dates', () => {
		const mockBasket = [
			{
				id: 1,
				startTime: '2026-03-05T10:00:00.000Z',
				endTime: '2026-03-05T11:00:00.000Z',
				bayId: 1,
				slotIds: [1],
			},
		];
		localStorage.setItem(STORAGE_KEYS.BASKET, JSON.stringify(mockBasket));

		const result = getBasket();
		expect(result).toHaveLength(1);
		expect(result[0].id).toBe(1);
		expect(result[0].bayId).toBe(1);
		expect(result[0].slotIds).toEqual([1]);
		expect(dayjs.isDayjs(result[0].startTime)).toBe(true);
		expect(dayjs.isDayjs(result[0].endTime)).toBe(true);
	});

	it('saveBasket should save data to localStorage', () => {
		const mockBasket = [{ id: 1 }];
		saveBasket(mockBasket as any);

		expect(localStorage.getItem(STORAGE_KEYS.BASKET)).toEqual(
			JSON.stringify(mockBasket),
		);
	});

	it('clearBasket should remove data from localStorage', () => {
		localStorage.setItem(STORAGE_KEYS.BASKET, 'test');
		clearBasket();
		expect(localStorage.getItem(STORAGE_KEYS.BASKET)).toBeNull();
	});
});
