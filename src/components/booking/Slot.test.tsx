import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Slot } from '@components/booking';
import dayjs from 'dayjs';

// Mock Hooks
vi.mock('@hooks', () => ({
	useBasket: () => ({
		addToBasket: vi.fn(),
		basket: [],
	}),
	useAuth: () => ({
		isAdmin: false,
	}),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

describe('Slot Component', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const mockTimeSlots = {
		'10:00': [
			{
				id: 1,
				time: '10:00',
				startTime: dayjs().add(1, 'day').hour(10).minute(0), // Future date
				endTime: dayjs().add(1, 'day').hour(11).minute(0),
				isBooked: false,
				price: 50,
				slotIds: [1],
			},
		],
	};

	it('renders an available slot correctly', () => {
		render(<Slot timeSlots={mockTimeSlots as any} slotKey="10:00" />);
		expect(screen.getByText(/10:00am/i)).toBeInTheDocument();
	});

	it('renders "Sold Out" button when no slots are available', () => {
		const bookedSlots = {
			'10:00': [
				{
					id: 1,
					time: '10:00',
					startTime: dayjs().add(1, 'day').hour(10).minute(0),
					endTime: dayjs().add(1, 'day').hour(11).minute(0),
					slotIds: [1],
					isBooked: true,
				},
			],
		};

		const pastTimeSlots = {
			'10:00': [
				{
					id: 1,
					time: '10:00',
					startTime: dayjs().subtract(1, 'day'),
					endTime: dayjs().subtract(1, 'day').add(1, 'hour'),
					slotIds: [1],
					isBooked: false,
				},
			],
		};

		render(<Slot timeSlots={pastTimeSlots as any} slotKey="10:00" />);
		expect(screen.getByText(/Unavailable/i)).toBeInTheDocument();
	});
});
