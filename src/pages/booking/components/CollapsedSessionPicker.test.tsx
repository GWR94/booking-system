import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import CollapsedSessionPicker from './CollapsedSessionPicker';
import dayjs from 'dayjs';
import { useSession } from '@hooks';

vi.mock('@hooks', () => ({
	useSession: vi.fn(),
}));

vi.mock('framer-motion', () => ({
	motion: {
		div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
	},
}));

vi.mock('@mui/material', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@mui/material')>();
	return {
		...actual,
		useTheme: () => ({
			palette: {
				primary: { main: 'blue' },
				secondary: { main: 'yellow' },
				accent: { main: 'teal' },
				text: { secondary: 'gray' },
			},
		}),
	};
});

describe('CollapsedSessionPicker', () => {
	it('renders session details correctly', () => {
		(useSession as any).mockReturnValue({
			selectedDate: dayjs('2024-05-10'),
			selectedSession: 2,
			selectedBay: 1,
		});
		const mockSetIsExpanded = vi.fn();

		render(<CollapsedSessionPicker setIsExpanded={mockSetIsExpanded} />);

		expect(screen.getByText(/Friday May 10th '24/)).toBeInTheDocument();
		expect(screen.getByText(/2 Hours Session/)).toBeInTheDocument();
		expect(screen.getByText(/Bay 1/)).toBeInTheDocument();
	});

	it('renders "Any Bay" correctly', () => {
		(useSession as any).mockReturnValue({
			selectedDate: dayjs('2024-05-10'),
			selectedSession: 1,
			selectedBay: 5,
		});
		const mockSetIsExpanded = vi.fn();

		render(<CollapsedSessionPicker setIsExpanded={mockSetIsExpanded} />);

		expect(screen.getByText(/1 Hour Session/)).toBeInTheDocument();
		expect(screen.getByText(/Any Bay/)).toBeInTheDocument();
	});

	it('calls setIsExpanded on click', () => {
		(useSession as any).mockReturnValue({
			selectedDate: dayjs(),
			selectedSession: 1,
			selectedBay: 5,
		});
		const mockSetIsExpanded = vi.fn();

		render(<CollapsedSessionPicker setIsExpanded={mockSetIsExpanded} />);

		const container = screen.getByText(/Any Bay/).closest('div')?.parentElement; // The Clickable Box
		fireEvent.click(screen.getByText(/Any Bay/));

		expect(mockSetIsExpanded).toHaveBeenCalledWith(true);
	});
});
