import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import GenerateSlots from './GenerateSlots';
import dayjs from 'dayjs';

vi.mock('../../hooks/useSlots', () => ({
	useSlots: vi.fn(),
}));

// Mock the child component to avoid complex setup
vi.mock('./Slot', () => ({
	default: ({ slotKey }: any) => <div data-testid="mock-slot">{slotKey}</div>,
}));

import { useSlots } from '../../hooks/useSlots';

describe('GenerateSlots', () => {
	it('renders loading spinner', () => {
		(useSlots as any).mockReturnValue({
			isLoading: true,
			groupedTimeSlots: {},
		});

		render(<GenerateSlots />);
		expect(screen.getByRole('progressbar')).toBeInTheDocument();
	});

	it('renders empty state message', () => {
		(useSlots as any).mockReturnValue({
			isLoading: false,
			groupedTimeSlots: {},
		});

		render(<GenerateSlots />);
		expect(screen.getByText('No available time slots')).toBeInTheDocument();
	});

	it('renders slots correctly', () => {
		const futureTime = dayjs().add(2, 'hours').toISOString();
		const groupedTimeSlots = {
			'10:00': [{ startTime: futureTime }],
			'11:00': [{ startTime: dayjs().add(3, 'hours').toISOString() }],
		};

		(useSlots as any).mockReturnValue({
			isLoading: false,
			groupedTimeSlots,
		});

		render(<GenerateSlots />);

		expect(screen.getAllByTestId('mock-slot')).toHaveLength(2);
		expect(screen.getByText('10:00')).toBeInTheDocument();
		expect(screen.getByText('11:00')).toBeInTheDocument();
	});
});
