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
		// Default date is today
		expect(result.current.selectedDate.isSame(dayjs(), 'day')).toBe(true);
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
});
