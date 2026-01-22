import { describe, it, expect, vi, beforeEach } from 'vitest';
import { axios } from '@utils';
import dayjs from 'dayjs';
import {
	fetchSlots,
	getBasket,
	saveBasket,
	clearBasket,
	STORAGE_KEYS,
} from './basket';

vi.mock('@utils', () => ({
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

	it('getBasket should return parsed data from localStorage', () => {
		const mockBasket = [{ id: 1 }];
		localStorage.setItem(STORAGE_KEYS.BASKET, JSON.stringify(mockBasket));

		const result = getBasket();
		expect(result).toEqual(mockBasket);
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
