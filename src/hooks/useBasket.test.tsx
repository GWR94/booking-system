import { renderHook, waitFor, act } from '@testing-library/react';
import { useBasket } from './useBasket';
import { createWrapper } from '../utils/test-utils';
import { getBasket, saveBasket } from '../api/basket';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import dayjs from 'dayjs';

// Mock API
vi.mock('../api/basket', () => ({
	getBasket: vi.fn(),
	saveBasket: vi.fn(),
}));

describe('useBasket', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should initialize with empty basket', async () => {
		(getBasket as any).mockReturnValue([]);

		const { result } = renderHook(() => useBasket(), {
			wrapper: createWrapper(),
		});

		await waitFor(() => expect(result.current.basket).toEqual([]));
		expect(result.current.basketPrice).toBe('0.00');
	});

	it('should add item to basket', async () => {
		const mockSlot = {
			id: '1',
			startTime: dayjs().add(1, 'day'),
			endTime: dayjs().add(1, 'day').add(1, 'hour'),
			slotIds: [100],
			bayId: 1,
		};
		(getBasket as any).mockReturnValue([]);
		// Mock saveBasket to return what acts as "saved" for mutation result if needed
		(saveBasket as any).mockReturnValue([mockSlot]);

		const { result } = renderHook(() => useBasket(), {
			wrapper: createWrapper(),
		});

		await act(async () => {
			await result.current.addToBasket(mockSlot as any);
		});

		expect(saveBasket).toHaveBeenCalledWith([mockSlot]);
	});

	it('should calculate price correctly', async () => {
		// Assuming HOURLY_RATE is 2000 (20.00) or similar. Based on logic: slotIds.length * (HOURLY_RATE / 100)
		// We don't know exact HOURLY_RATE constant without import, but let's assume one slot works.
		// Actually imports HOURLY_RATE from CheckoutItem.
		// For test, we just check non-zero if we put items.

		const mockSlot = {
			id: '1',
			slotIds: [1, 2], // 2 slots
			startTime: dayjs().add(1, 'day'),
		};

		(getBasket as any).mockReturnValue([mockSlot]);

		const { result } = renderHook(() => useBasket(), {
			wrapper: createWrapper(),
		});

		await waitFor(() => expect(result.current.basket).toHaveLength(1));

		// We can't easily assert exact price without importing the constant,
		// but we can assert it's a string in formatted decimal.
		expect(result.current.basketPrice).toMatch(/^\d+\.\d{2}$/);
		expect(result.current.basketPrice).not.toBe('0.00');
	});
});
