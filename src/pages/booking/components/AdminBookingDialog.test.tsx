import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import AdminBookingDialog from './AdminBookingDialog';
import { axios } from '@utils';
import dayjs from 'dayjs';
import { ThemeProvider } from '@context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('@api', () => ({
	createAdminBooking: vi.fn(),
}));

import { createAdminBooking } from '@api';

const mockOnClose = vi.fn();
const mockSlot = {
	id: 1,
	startTime: '2024-01-01T10:00:00',
	endTime: '2024-01-01T11:00:00',
	slotIds: [101, 102],
	bayId: 1,
};

describe('AdminBookingDialog', () => {
	it('renders correctly with slot details', () => {
		render(
			<ThemeProvider>
				<QueryClientProvider client={new QueryClient()}>
					<AdminBookingDialog
						open={true}
						onClose={mockOnClose}
						slot={mockSlot as any}
						startTime="2024-01-01T10:00:00"
						endTime="2024-01-01T11:00:00"
					/>
				</QueryClientProvider>
			</ThemeProvider>,
		);

		expect(screen.getByText('Confirm Admin Booking')).toBeInTheDocument();
		expect(screen.getByText('Bay 1')).toBeInTheDocument();
		expect(screen.getByText('10:00 - 11:00')).toBeInTheDocument();
	});

	it('handles booking flow success', async () => {
		const mockBookingResponse = {
			booking: {
				id: 123,
				slots: [{ bayId: 1 }],
			},
		};
		(createAdminBooking as any).mockResolvedValue(mockBookingResponse);

		render(
			<ThemeProvider>
				<QueryClientProvider client={new QueryClient()}>
					<AdminBookingDialog
						open={true}
						onClose={mockOnClose}
						slot={mockSlot as any}
						startTime="2024-01-01T10:00:00"
						endTime="2024-01-01T11:00:00"
					/>
				</QueryClientProvider>
			</ThemeProvider>,
		);

		const confirmButton = screen.getByRole('button', {
			name: /confirm booking/i,
		});
		fireEvent.click(confirmButton);

		expect(createAdminBooking).toHaveBeenCalledWith([101, 102]);

		await waitFor(() => {
			expect(screen.getByText('Booking Confirmed!')).toBeInTheDocument();
		});
		expect(screen.getByText('123')).toBeInTheDocument();
	});
});
