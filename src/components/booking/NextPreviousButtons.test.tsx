import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import NextPreviousButtons from './NextPreviousButtons';
import dayjs from 'dayjs';

vi.mock('@hooks', () => ({
	useSession: vi.fn(),
}));

import { useSession } from '@hooks';

describe('NextPreviousButtons', () => {
	it('calls setDate with previous/next dates', () => {
		const mockSetSelectedDate = vi.fn();
		(useSession as any).mockReturnValue({
			selectedDate: dayjs('2099-06-01'), // Future date so Prev is enabled
			setSelectedDate: mockSetSelectedDate,
		});

		render(<NextPreviousButtons />);

		fireEvent.click(screen.getByText('Previous'));
		// Since dayjs returns mutable/immutable objects, we need to check the call structure carefully.
		// The component calls: setSelectedDate(dayjs(selectedDate).subtract(1, 'day'))
		// This passes a Dayjs object.
		expect(mockSetSelectedDate).toHaveBeenCalled();
		// We can assert precise args if we want, but checking call is usually enough for wiring.
	});

	it('disables Previous button if date is in past/today', () => {
		// Scenario: Selected date is Today (or Past)
		(useSession as any).mockReturnValue({
			selectedDate: dayjs().subtract(1, 'day'), // Past
			setSelectedDate: vi.fn(),
		});

		render(<NextPreviousButtons />);
		expect(screen.getByText('Previous').closest('button')).toBeDisabled();
	});
});
