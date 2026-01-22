import { renderHook, waitFor, act } from '@testing-library/react';
import { useSession } from './useSession';
import createWrapper from '@utils/test-utils';
import { describe, it, expect } from 'vitest';
import dayjs from 'dayjs';

describe('useSession', () => {
	it('should initialize with default values', async () => {
		const { result } = renderHook(() => useSession(), {
			wrapper: createWrapper(),
		});

		await waitFor(() => {
			expect(result.current.selectedSession).toBe(1);
		});
		expect(result.current.selectedBay).toBe(5);
		// Default date is today unless it's past 9PM, then it's tomorrow
		const expectedDate = dayjs().isAfter(dayjs().hour(21).startOf('hour'))
			? dayjs().add(1, 'day')
			: dayjs();
		expect(result.current.selectedDate.isSame(expectedDate, 'day')).toBe(true);
	});

	it('should update session values', async () => {
		const { result } = renderHook(() => useSession(), {
			wrapper: createWrapper(),
		});

		await act(async () => {
			result.current.setSelectedSession(2);
		});

		await waitFor(() => expect(result.current.selectedSession).toBe(2));

		await act(async () => {
			result.current.setSelectedBay(4);
		});

		await waitFor(() => expect(result.current.selectedBay).toBe(4));
	});

	it('should update selected date', async () => {
		const { result } = renderHook(() => useSession(), {
			wrapper: createWrapper(),
		});

		const newDate = dayjs().add(5, 'days');

		await act(async () => {
			result.current.setSelectedDate(newDate);
		});

		await waitFor(() => {
			expect(result.current.selectedDate.isSame(newDate, 'day')).toBe(true);
		});
	});
});
