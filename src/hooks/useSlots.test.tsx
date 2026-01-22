import { renderHook, waitFor } from '@testing-library/react';
import { useSlots } from './useSlots';
import createWrapper from '@utils/test-utils';
import { fetchSlots } from '@api';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@api/basket', () => ({
	fetchSlots: vi.fn(),
	getBasket: vi.fn().mockReturnValue([]), // Used by useBasket internally
}));

describe('useSlots', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should fetch slots for selected date', async () => {
		const mockSlots = [{ id: 1, time: '10:00', bayId: 1 }];
		(fetchSlots as any).mockResolvedValue(mockSlots);

		const { result } = renderHook(() => useSlots(), {
			wrapper: createWrapper(),
		});

		await waitFor(() => expect(result.current.isLoading).toBe(false));
		expect(result.current.slots).toEqual(mockSlots);
	});

	it('should return grouped time slots', async () => {
		const mockSlots = [
			{ id: 1, time: '10:00', bayId: 1, sessionId: 1, booked: false },
			{ id: 2, time: '11:00', bayId: 1, sessionId: 1, booked: false },
		];
		(fetchSlots as any).mockResolvedValue(mockSlots);

		const { result } = renderHook(() => useSlots(), {
			wrapper: createWrapper(),
		});

		await waitFor(() => expect(result.current.isLoading).toBe(false));
		expect(result.current.groupedTimeSlots).toBeDefined();
		expect(typeof result.current.groupedTimeSlots).toBe('object');
	});

	it('should handle error state', async () => {
		const errorMessage = 'Failed to fetch slots';
		(fetchSlots as any).mockRejectedValue(new Error(errorMessage));

		const { result } = renderHook(() => useSlots(), {
			wrapper: createWrapper(),
		});

		await waitFor(() => expect(result.current.isLoading).toBe(false));
		expect(result.current.error).toBeTruthy();
	});
});
