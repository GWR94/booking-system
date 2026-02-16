import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Booking from './Booking';
import createWrapper from '@utils/test-utils';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme();
const mockUseSlots = vi.fn();

vi.mock('@hooks', () => ({
	useSlots: () => mockUseSlots(),
	useAuth: vi.fn(() => ({
		user: null,
		isAdmin: false,
	})),
}));

vi.mock('./components', () => ({
	GenerateSlots: () => <div>Generate Slots Component</div>,
	SessionPicker: () => <div>Session Picker Component</div>,
	NextPreviousButtons: () => <div>Next Previous Buttons Component</div>,
}));

vi.mock('@ui', () => ({
	LoadingSpinner: () => <div data-testid="loading-spinner">Loading...</div>,
	SectionHeader: ({ title, subtitle }: any) => (
		<div data-testid="section-header">
			{title} {subtitle}
		</div>
	),
}));

describe('Booking Page', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders page title and subtitle', () => {
		mockUseSlots.mockReturnValue({ isLoading: false });

		render(
			<ThemeProvider theme={theme}>
				<Booking />
			</ThemeProvider>,
			{ wrapper: createWrapper() },
		);

		expect(screen.getByTestId('section-header')).toHaveTextContent(
			'Book Your Session Instant Reservations',
		);
	});

	it('renders SessionPicker component', () => {
		mockUseSlots.mockReturnValue({ isLoading: false });

		render(
			<ThemeProvider theme={theme}>
				<Booking />
			</ThemeProvider>,
			{ wrapper: createWrapper() },
		);

		expect(screen.getByText('Session Picker Component')).toBeInTheDocument();
	});

	it('shows loading spinner when isLoading is true', () => {
		mockUseSlots.mockReturnValue({ isLoading: true });

		render(
			<ThemeProvider theme={theme}>
				<Booking />
			</ThemeProvider>,
			{ wrapper: createWrapper() },
		);

		expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
		expect(
			screen.queryByText('Generate Slots Component'),
		).not.toBeInTheDocument();
		expect(
			screen.queryByText('Next Previous Buttons Component'),
		).not.toBeInTheDocument();
	});

	it('shows GenerateSlots and NextPreviousButtons when loaded', () => {
		mockUseSlots.mockReturnValue({ isLoading: false });

		render(
			<ThemeProvider theme={theme}>
				<Booking />
			</ThemeProvider>,
			{ wrapper: createWrapper() },
		);

		expect(screen.getByText('Generate Slots Component')).toBeInTheDocument();
		expect(
			screen.getByText('Next Previous Buttons Component'),
		).toBeInTheDocument();
		expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
	});
});
