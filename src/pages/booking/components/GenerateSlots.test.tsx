import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import GenerateSlots from './GenerateSlots';
import dayjs from 'dayjs';
import { useSlots, useBasket } from '@hooks';

vi.mock('@hooks', () => ({
	useSlots: vi.fn(),
	useSession: vi.fn(() => ({
		selectedBay: 5,
	})),
	useBasket: vi.fn(() => ({
		basket: [],
		basketPrice: 0,
		clearBasket: vi.fn(),
	})),
}));

vi.mock('@mui/material', async () => {
	const actual = await vi.importActual('@mui/material');
	return {
		...actual,
		alpha: (color: string, opacity: number) => `alpha(${color}, ${opacity})`,
		useTheme: vi.fn(() => ({
			palette: {
				primary: { main: '#000' },
				error: { main: '#f00' },
				background: { paper: '#fff' },
				common: { black: '#000' },
				divider: '#ccc',
			},
			breakpoints: {
				down: vi.fn(() => '(max-width:900px)'),
			},
		})),
		useMediaQuery: vi.fn(() => true),
		Slide: ({ children, in: open }: any) => (open ? children : null),
		Button: ({ children, onClick }: any) => (
			<button onClick={onClick}>{children}</button>
		),
	};
});

// Mock the child component to avoid complex setup
vi.mock('./Slot', () => ({
	default: ({ timeRange }: any) => (
		<div data-testid="mock-slot">{timeRange}</div>
	),
}));

describe('GenerateSlots', () => {
	it('renders loading spinner', () => {
		(useSlots as any).mockReturnValue({
			isLoading: true,
			groupedTimeSlots: {},
		});

		render(<GenerateSlots />);
		expect(screen.getByRole('progressbar')).toBeInTheDocument();
	});

	it('renders empty state message', () => {
		(useSlots as any).mockReturnValue({
			isLoading: false,
			groupedTimeSlots: {},
		});

		render(<GenerateSlots />);
		expect(screen.getByText('No available time slots')).toBeInTheDocument();
	});

	it('renders slots correctly', () => {
		const futureTime = dayjs().add(2, 'hours').toISOString();
		const groupedTimeSlots = {
			'10:00': [{ startTime: futureTime }],
			'11:00': [{ startTime: dayjs().add(3, 'hours').toISOString() }],
		};

		(useSlots as any).mockReturnValue({
			isLoading: false,
			groupedTimeSlots,
		});

		render(<GenerateSlots />);

		expect(screen.getAllByTestId('mock-slot')).toHaveLength(2);
		expect(screen.getByText('10:00')).toBeInTheDocument();
		expect(screen.getByText('11:00')).toBeInTheDocument();
	});

	it('renders sticky footer when basket is not empty', () => {
		(useSlots as any).mockReturnValue({
			isLoading: false,
			groupedTimeSlots: {
				'10:00': [{ startTime: dayjs().add(2, 'hours').toISOString() }],
			},
		});

		(useBasket as any).mockReturnValue({
			basket: [{ id: 1 }],
			basketPrice: 50,
			clearBasket: vi.fn(),
		});

		render(<GenerateSlots />);

		expect(screen.getByText(/1 slot selected/i)).toBeInTheDocument();
		expect(screen.getByText(/£50/i)).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: /CHECKOUT/i }),
		).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /CLEAR/i })).toBeInTheDocument();
	});
});
