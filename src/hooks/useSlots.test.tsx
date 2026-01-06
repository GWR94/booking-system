import { renderHook, waitFor } from '@testing-library/react';
import { useSlots } from './useSlots';
import { createWrapper } from '../utils/test-utils';
import { fetchSlots } from '../api/basket';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../api/basket', () => ({
	fetchSlots: vi.fn(),
	getBasket: vi.fn().mockReturnValue([]), // Used by useBasket internally
}));

// Mock utils if complex, or let it run.
// Let's assert on the raw slots first to ensure data fetching works.

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
});
