import { Dayjs } from 'dayjs';
import { SessionTimes } from '../../pages/Booking';
import { Booking } from './Booking.i';

export type Bays = 1 | 2 | 3 | 4 | 5;

export interface BookingContextType {
	selectedDate: Dayjs;
	selectedSession: SessionTimes;
	selectedBay: Bays;
	setSelectedBay: (bay: Bays) => void;
	setSelectedDate: (date: Dayjs) => void;
	setSelectedSession: (session: SessionTimes) => void;
	isLoading: boolean;
	groupedTimeSlots: GroupedTimeSlots;
	basket: GroupedSlot[];
	basketPrice: string;
	booking: Booking | null;
	addToBasket: (slot: GroupedSlot) => void;
	removeFromBasket: (slot: GroupedSlot) => void;
	setBooking: (booking: Booking | null) => void;
	clearBasket: () => void;
	clearBooking: () => void;
}

export interface BookingProviderProps {
	children: React.ReactNode;
}

export interface TimeSlot {
	id: number;
	startTime: string;
	endTime: string;
	status: string;
	bayId: number;
}

export interface GroupedSlot {
	id: number;
	startTime: Dayjs;
	endTime: Dayjs;
	bayId: number;
	slotIds: number[];
	inBasket?: boolean;
}

export interface GroupedTimeSlots {
	[key: string]: GroupedSlot[];
}
