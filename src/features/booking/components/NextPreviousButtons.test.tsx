import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import NextPreviousButtons from './NextPreviousButtons';
import dayjs from 'dayjs';
import { useSession } from '@hooks';

vi.mock('@hooks', () => ({
	useSession: vi.fn(),
}));

describe('NextPreviousButtons', () => {
	it('calls setDate with previous/next dates', () => {
		const mockSetSelectedDate = vi.fn();
		(useSession as any).mockReturnValue({
			selectedDate: dayjs('2099-06-01'),
			setSelectedDate: mockSetSelectedDate,
		});

		render(<NextPreviousButtons />);

		fireEvent.click(screen.getByText('Previous Day'));
		expect(mockSetSelectedDate).toHaveBeenCalled();
	});

	it('disables Previous button if date is in past/today', () => {
		(useSession as any).mockReturnValue({
			selectedDate: dayjs().subtract(1, 'day'), // Past
			setSelectedDate: vi.fn(),
		});

		render(<NextPreviousButtons />);
		expect(screen.getByText('Previous Day').closest('button')).toBeDisabled();
	});

	it('Does not disable Next button if date is in future', () => {
		const mockSetSelectedDate = vi.fn();
		(useSession as any).mockReturnValue({
			selectedDate: dayjs().add(10, 'day'), // Future
			setSelectedDate: mockSetSelectedDate,
		});

		render(<NextPreviousButtons />);
		expect(screen.getByText('Next Day').closest('button')).not.toBeDisabled();
	});
});
