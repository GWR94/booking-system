import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import dayjs from 'dayjs';

import UserBookingDetailsDialog from './UserBookingDetailsDialog';
import createWrapper from '@utils/test-utils';

const getStatusColor = vi.fn((status: string) =>
	status === 'cancelled' ? 'error' : 'success',
) as (status: string) => 'success' | 'warning' | 'error' | 'default';

const baseBooking = {
	id: 1,
	status: 'confirmed',
	bookingTime: dayjs().toISOString(),
	slots: [
		{
			id: 10,
			startTime: dayjs().add(1, 'day').hour(10).minute(0).toISOString(),
			endTime: dayjs().add(1, 'day').hour(11).minute(0).toISOString(),
			bayId: 1,
		},
	],
};

describe('UserBookingDetailsDialog', () => {
	it('returns null when booking is null', () => {
		const { container } = render(
			<UserBookingDetailsDialog
				booking={null}
				open={true}
				onClose={vi.fn()}
				onCancelBooking={vi.fn()}
				getStatusColor={getStatusColor}
			/>,
			{ wrapper: createWrapper() },
		);
		expect(container.firstChild).toBeNull();
	});

	it('renders Booking Details and status chip when open with booking', () => {
		render(
			<UserBookingDetailsDialog
				booking={baseBooking}
				open={true}
				onClose={vi.fn()}
				onCancelBooking={vi.fn()}
				getStatusColor={getStatusColor}
			/>,
			{ wrapper: createWrapper() },
		);
		expect(screen.getByText('Booking Details')).toBeInTheDocument();
		expect(screen.getByText('confirmed')).toBeInTheDocument();
	});

	it('renders session info and bay selection', () => {
		render(
			<UserBookingDetailsDialog
				booking={baseBooking}
				open={true}
				onClose={vi.fn()}
				onCancelBooking={vi.fn()}
				getStatusColor={getStatusColor}
			/>,
			{ wrapper: createWrapper() },
		);
		expect(screen.getByText('Session Information')).toBeInTheDocument();
		expect(screen.getByText('Bay Selection')).toBeInTheDocument();
		expect(screen.getByText(/Bay 1/)).toBeInTheDocument();
	});

	it('calls onClose when Close is clicked', () => {
		const onClose = vi.fn();
		render(
			<UserBookingDetailsDialog
				booking={baseBooking}
				open={true}
				onClose={onClose}
				onCancelBooking={vi.fn()}
				getStatusColor={getStatusColor}
			/>,
			{ wrapper: createWrapper() },
		);
		fireEvent.click(screen.getByRole('button', { name: /Close/i }));
		expect(onClose).toHaveBeenCalled();
	});

	it('shows Cancel Booking and calls onCancelBooking when booking is not in past and not cancelled', () => {
		const onCancelBooking = vi.fn();
		render(
			<UserBookingDetailsDialog
				booking={baseBooking}
				open={true}
				onClose={vi.fn()}
				onCancelBooking={onCancelBooking}
				getStatusColor={getStatusColor}
			/>,
			{ wrapper: createWrapper() },
		);
		fireEvent.click(screen.getByRole('button', { name: /Cancel Booking/i }));
		expect(onCancelBooking).toHaveBeenCalledWith(1);
	});

	it('does not show Cancel Booking when status is cancelled', () => {
		render(
			<UserBookingDetailsDialog
				booking={{ ...baseBooking, status: 'cancelled' }}
				open={true}
				onClose={vi.fn()}
				onCancelBooking={vi.fn()}
				getStatusColor={getStatusColor}
			/>,
			{ wrapper: createWrapper() },
		);
		expect(screen.queryByRole('button', { name: /Cancel Booking/i })).not.toBeInTheDocument();
	});

	it('renders duration with singular Hour for one slot', () => {
		render(
			<UserBookingDetailsDialog
				booking={baseBooking}
				open={true}
				onClose={vi.fn()}
				onCancelBooking={vi.fn()}
				getStatusColor={getStatusColor}
			/>,
			{ wrapper: createWrapper() },
		);
		expect(screen.getByText('1 Hour')).toBeInTheDocument();
	});

	it('renders duration with plural Hours for multiple slots', () => {
		const booking = {
			...baseBooking,
			slots: [
				baseBooking.slots[0],
				{
					id: 11,
					startTime: dayjs().add(1, 'day').hour(11).minute(0).toISOString(),
					endTime: dayjs().add(1, 'day').hour(12).minute(0).toISOString(),
					bayId: 2,
				},
			],
		};
		render(
			<UserBookingDetailsDialog
				booking={booking}
				open={true}
				onClose={vi.fn()}
				onCancelBooking={vi.fn()}
				getStatusColor={getStatusColor}
			/>,
			{ wrapper: createWrapper() },
		);
		expect(screen.getByText('2 Hours')).toBeInTheDocument();
	});
});
