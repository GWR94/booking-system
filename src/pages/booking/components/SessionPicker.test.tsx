import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import SessionPicker from './SessionPicker';
import dayjs from 'dayjs';

const mockSetSelectedDate = vi.fn();
const mockSetSelectedSession = vi.fn();
const mockSetSelectedBay = vi.fn();

vi.mock('@hooks', () => ({
	useSession: () => ({
		selectedDate: dayjs('2024-01-01'),
		selectedSession: 1,
		selectedBay: 5, // Any Bay
		setSelectedDate: mockSetSelectedDate,
		setSelectedSession: mockSetSelectedSession,
		setSelectedBay: mockSetSelectedBay,
	}),
}));

// Mock DatePicker to simplify interaction
vi.mock('@mui/x-date-pickers', () => ({
	DatePicker: ({ label, onChange }: any) => (
		<div>
			<label>{label}</label>
			<input
				data-testid="date-picker-input"
				onChange={(e) => onChange(dayjs(e.target.value))}
			/>
		</div>
	),
}));

// Mock framer-motion to avoid animation issues in test env
vi.mock('framer-motion', () => ({
	motion: {
		div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
	},
	AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('SessionPicker', () => {
	it('renders title and controls', () => {
		render(<SessionPicker />);
		expect(screen.getByText('Find Available Sessions')).toBeInTheDocument();
		expect(screen.getByLabelText(/Duration/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Bay/i)).toBeInTheDocument();
	});

	it('calls setSelectedSession when duration changes', () => {
		render(<SessionPicker />);
		const durationSelect = screen.getByRole('combobox', { name: /Duration/i });
		expect(durationSelect).toBeInTheDocument();

		fireEvent.mouseDown(durationSelect);
		const option2Hours = screen.getByRole('option', { name: /2 Hours/i });
		fireEvent.click(option2Hours);

		expect(mockSetSelectedSession).toHaveBeenCalledWith(2);
	});

	it('calls setSelectedBay when bay changes', () => {
		render(<SessionPicker />);
		const baySelect = screen.getByRole('combobox', { name: /Bay/i });

		fireEvent.mouseDown(baySelect);
		const optionBay1 = screen.getByRole('option', { name: /Bay 1/i });
		fireEvent.click(optionBay1);

		expect(mockSetSelectedBay).toHaveBeenCalledWith(1);
	});
});
