import { renderHook, waitFor, act } from '@testing-library/react';
import { useBookingManager } from './useBookingManager';
import { createWrapper } from '../utils/test-utils';
import { getStoredBooking, saveStoredBooking } from '../api/booking';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../api/booking', () => ({
	getStoredBooking: vi.fn(),
	saveStoredBooking: vi.fn(),
}));

describe('useBookingManager', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should fetch stored booking', async () => {
		const mockBooking = { id: 1, status: 'pending' };
		(getStoredBooking as any).mockReturnValue(mockBooking);

		const { result } = renderHook(() => useBookingManager(), {
			wrapper: createWrapper(),
		});

		await waitFor(() => expect(result.current.booking).toEqual(mockBooking));
	});

	it('should clear booking', async () => {
		(getStoredBooking as any).mockReturnValue({ id: 1 });

		const { result } = renderHook(() => useBookingManager(), {
			wrapper: createWrapper(),
		});
		await waitFor(() => expect(result.current.booking).toBeTruthy());

		await act(async () => {
			await result.current.clearBooking();
		});

		expect(saveStoredBooking).toHaveBeenCalledWith(null);
	});
});
