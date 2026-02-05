import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BookingsTable from './BookingsTable';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme();

const mockBookings = [
	{
		id: '1',
		user: { name: 'John Doe', email: 'john@example.com' },
		slots: [
			{ startTime: '2024-01-20T10:00:00Z', endTime: '2024-01-20T11:00:00Z' },
		],
		status: 'confirmed',
	},
	{
		id: '2',
		user: { name: 'Jane Smith', email: 'jane@example.com' },
		slots: [
			{ startTime: '2024-01-21T12:00:00Z', endTime: '2024-01-21T13:00:00Z' },
		],
		status: 'pending',
	},
];

describe('BookingsTable', () => {
	const defaultProps = {
		bookings: mockBookings,
		totalBookings: 2,
		page: 0,
		rowsPerPage: 10,
		search: '',
		onPageChange: vi.fn(),
		onRowsPerPageChange: vi.fn(),
		onSearchChange: vi.fn(),
		onViewDetails: vi.fn(),
		getStatusColor: vi.fn(() => 'success' as const),
	};

	it('should render table headers and data correctly', async () => {
		render(
			<ThemeProvider theme={theme}>
				<BookingsTable {...defaultProps} />
			</ThemeProvider>,
		);

		expect(screen.getByText('ID')).toBeInTheDocument();
		expect(screen.getByText('User')).toBeInTheDocument();
		expect(await screen.findByText('John Doe')).toBeInTheDocument();
	});

	it('should call onSearchChange when search input changes', () => {
		render(
			<ThemeProvider theme={theme}>
				<BookingsTable {...defaultProps} />
			</ThemeProvider>,
		);

		const searchInput = screen.getByPlaceholderText(/Search bookings/i);
		fireEvent.change(searchInput, { target: { value: 'test' } });
		expect(defaultProps.onSearchChange).toHaveBeenCalledWith('test');
	});

	it('should call onViewDetails when a row is clicked', () => {
		render(
			<ThemeProvider theme={theme}>
				<BookingsTable {...defaultProps} />
			</ThemeProvider>,
		);

		fireEvent.click(screen.getByText('John Doe'));
		expect(defaultProps.onViewDetails).toHaveBeenCalledWith(mockBookings[0]);
	});

	it('should call onPageChange when pagination changes', () => {
		render(
			<ThemeProvider theme={theme}>
				<BookingsTable {...defaultProps} totalBookings={100} />
			</ThemeProvider>,
		);

		const nextButton = screen.getByLabelText('Go to next page');
		fireEvent.click(nextButton);
		expect(defaultProps.onPageChange).toHaveBeenCalled();
	});
});
