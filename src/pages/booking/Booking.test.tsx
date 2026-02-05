import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Booking from './Booking';

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
	LoadingSpinner: ({ sx }: any) => (
		<div data-testid="loading-spinner">Loading...</div>
	),
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

		render(<Booking />);

		expect(
			screen.getByRole('heading', { name: /Book Your Session/i }),
		).toBeInTheDocument();
		expect(
			screen.getByText(/Choose your preferred time and bay to get started/i),
		).toBeInTheDocument();
	});

	it('renders SessionPicker component', () => {
		mockUseSlots.mockReturnValue({ isLoading: false });

		render(<Booking />);

		expect(screen.getByText('Session Picker Component')).toBeInTheDocument();
	});

	it('shows loading spinner when isLoading is true', () => {
		mockUseSlots.mockReturnValue({ isLoading: true });

		render(<Booking />);

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

		render(<Booking />);

		expect(screen.getByText('Generate Slots Component')).toBeInTheDocument();
		expect(
			screen.getByText('Next Previous Buttons Component'),
		).toBeInTheDocument();
		expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
	});
});
