import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BookingDetailsDialog from './BookingDetailsDialog';
import { ThemeProvider, createTheme } from '@mui/material';
import dayjs from 'dayjs';

const theme = createTheme();

const mockBooking = {
	id: '123',
	status: 'confirmed',
	bookingTime: '2024-01-20T10:00:00Z',
	user: {
		name: 'John Doe',
		email: 'john@example.com',
		phone: '0123456789',
	},
	slots: [
		{
			id: 'slot1',
			startTime: '2024-01-20T10:00:00Z',
			endTime: '2024-01-20T11:00:00Z',
			bay: { name: 'Bay 1' },
		},
	],
};

describe('BookingDetailsDialog', () => {
	const defaultProps = {
		booking: mockBooking,
		open: true,
		onClose: vi.fn(),
		onCancelBooking: vi.fn(),
		onConfirmBooking: vi.fn(),
		onExtend1Hour: vi.fn(),
		onExtend2Hour: vi.fn(),
		extendAvailability: {
			canExtend1Hour: false,
			canExtend2Hours: false,
		},
		isExtending: false,
		getStatusColor: vi.fn(() => 'success' as const),
	};

	it('should render booking details correctly', () => {
		render(
			<ThemeProvider theme={theme}>
				<BookingDetailsDialog {...defaultProps} />
			</ThemeProvider>,
		);

		expect(screen.getByText(/Booking #123/i)).toBeInTheDocument();
		expect(screen.getByText('John Doe')).toBeInTheDocument();
		expect(screen.getByText('john@example.com')).toBeInTheDocument();
		expect(screen.getByText('0123456789')).toBeInTheDocument();
		expect(screen.getByText('Bay 1')).toBeInTheDocument();
	});

	it('should show extension buttons when active and available', () => {
		const activeBooking = {
			...mockBooking,
			slots: [
				{
					id: 'slot1',
					startTime: dayjs().subtract(30, 'minute').toISOString(),
					endTime: dayjs().add(30, 'minute').toISOString(),
					bay: { name: 'Bay 1' },
				},
			],
		};

		render(
			<ThemeProvider theme={theme}>
				<BookingDetailsDialog
					{...defaultProps}
					booking={activeBooking}
					extendAvailability={{ canExtend1Hour: true, canExtend2Hours: true }}
				/>
			</ThemeProvider>,
		);

		expect(screen.getByText('Extend Booking')).toBeInTheDocument();
		expect(screen.getByText('Add 1 Hour')).toBeInTheDocument();
		expect(screen.getByText('Add 2 Hours')).toBeInTheDocument();
	});

	it('should call onClose when Close button is clicked', () => {
		render(
			<ThemeProvider theme={theme}>
				<BookingDetailsDialog {...defaultProps} />
			</ThemeProvider>,
		);

		fireEvent.click(screen.getByText('Close'));
		expect(defaultProps.onClose).toHaveBeenCalled();
	});

	it('should show confirm button if status is not confirmed', () => {
		render(
			<ThemeProvider theme={theme}>
				<BookingDetailsDialog
					{...defaultProps}
					booking={{ ...mockBooking, status: 'pending' }}
				/>
			</ThemeProvider>,
		);

		expect(screen.getByText('Confirm')).toBeInTheDocument();
	});
});
