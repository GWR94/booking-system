import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import AdminBookingDialog from './AdminBookingDialog';
import axios from '../../utils/axiosConfig';
import dayjs from 'dayjs';

vi.mock('../../utils/axiosConfig', () => ({
	default: {
		post: vi.fn(),
	},
}));

const mockOnClose = vi.fn();
const mockSlots = [
	{
		id: 1,
		startTime: dayjs('2024-01-01T10:00:00'),
		endTime: dayjs('2024-01-01T11:00:00'),
		slotIds: [101, 102],
		bayId: 1,
	},
	{
		id: 2,
		startTime: dayjs('2024-01-01T10:00:00'),
		endTime: dayjs('2024-01-01T11:00:00'),
		slotIds: [201, 202],
		bayId: 2,
	},
];

describe('AdminBookingDialog', () => {
	it('renders correctly with slots', () => {
		render(
			<AdminBookingDialog
				open={true}
				onClose={mockOnClose}
				slots={mockSlots}
				startTime="2024-01-01T10:00:00"
				endTime="2024-01-01T11:00:00"
			/>,
		);

		expect(screen.getByText('Select a Bay')).toBeInTheDocument();
		expect(screen.getByText('Bay 1')).toBeInTheDocument();
		expect(screen.getByText('Bay 2')).toBeInTheDocument();
	});

	it('handles booking flow success', async () => {
		const mockBookingResponse = {
			data: {
				booking: {
					id: 123,
					slots: [{ bayId: 1 }],
				},
			},
		};
		(axios.post as any).mockResolvedValue(mockBookingResponse);

		render(
			<AdminBookingDialog
				open={true}
				onClose={mockOnClose}
				slots={mockSlots}
				startTime="2024-01-01T10:00:00"
				endTime="2024-01-01T11:00:00"
			/>,
		);

		const bay1Button = screen.getByText('Bay 1');
		fireEvent.click(bay1Button);

		expect(axios.post).toHaveBeenCalledWith('/api/booking', {
			slotIds: [101, 102],
		});

		await waitFor(() => {
			expect(screen.getByText('Booking Confirmed')).toBeInTheDocument();
		});
		expect(screen.getByText('Booking ID: 123')).toBeInTheDocument();
		expect(screen.getByText('Bay: 1')).toBeInTheDocument();
	});
});
