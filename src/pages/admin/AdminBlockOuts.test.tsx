import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminBlockOuts from './AdminBlockOuts';
import { ThemeProvider, createTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SnackbarProvider } from '@context';
import dayjs from 'dayjs';

const theme = createTheme();

// Mock UI components
vi.mock('@ui', () => ({
	AnimateIn: ({ children }: any) => <div>{children}</div>,
	LoadingSpinner: () => <div>Loading...</div>,
	SectionHeader: ({ title }: any) => <h1>{title}</h1>,
}));

// Mock API
vi.mock('@api', () => ({
	getSlots: vi.fn(),
	blockSlots: vi.fn(),
	unblockSlots: vi.fn(),
}));

import { getSlots, blockSlots, unblockSlots } from '@api';

const mockSlots = [
	{
		id: 1,
		startTime: dayjs().add(1, 'hour').toISOString(),
		endTime: dayjs().add(2, 'hour').toISOString(),
		status: 'available',
		bayId: 1,
	},
	{
		id: 2,
		startTime: dayjs().add(2, 'hour').toISOString(),
		endTime: dayjs().add(3, 'hour').toISOString(),
		status: 'maintenance',
		bayId: 1,
	},
	{
		id: 3,
		startTime: dayjs().add(3, 'hour').toISOString(),
		endTime: dayjs().add(4, 'hour').toISOString(),
		status: 'booked',
		bayId: 2,
	},
];

describe('AdminBlockOuts', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const renderBlockOuts = () => {
		return render(
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<SnackbarProvider>
					<ThemeProvider theme={theme}>
						<AdminBlockOuts />
					</ThemeProvider>
				</SnackbarProvider>
			</LocalizationProvider>,
		);
	};

	it('should render slots and handle toggle block', async () => {
		vi.mocked(getSlots).mockResolvedValue(mockSlots);
		renderBlockOuts();

		expect(await screen.findByText('available')).toBeInTheDocument();
		expect(screen.getByText('maintenance')).toBeInTheDocument();
		expect(screen.getByText('Booked')).toBeInTheDocument();

		const blockBtn = screen.getByText('Block');
		fireEvent.click(blockBtn);
		expect(blockSlots).toHaveBeenCalled();

		const unblockBtn = screen.getByText('Unblock');
		fireEvent.click(unblockBtn);
		expect(unblockSlots).toHaveBeenCalled();
	});

	it('should open confirm dialog for block day', async () => {
		vi.mocked(getSlots).mockResolvedValue(mockSlots);
		renderBlockOuts();

		const blockDayBtn = await screen.findByRole('button', {
			name: /Block Day/i,
		});
		fireEvent.click(blockDayBtn);

		expect(await screen.findByText(/Confirm Block Day/i)).toBeInTheDocument();
	});
});
