import { Dayjs } from 'dayjs';

export interface Booking {
	id: number;
	userId: number;
	slotId: number;
	bookingTime: Dayjs;
	status: StatusType;
	slots: iSlot[];
	paymentId: string;
	paymentStatus: string;
	user?: {
		name: string;
		email: string;
		phone?: string;
	};
}

export type StatusType =
	| 'available'
	| 'booked'
	| 'unavailable'
	| 'confirmed'
	| 'pending'
	| 'cancelled';

export interface iSlot {
	id: number;
	startTime: Dayjs;
	endTime: Dayjs;
	status: StatusType;
	bookings: Booking[];
	slots: number[];
	bayId: number;
}

export type Bays = 1 | 2 | 3 | 4 | 5;
export type SessionTimes = 1 | 2 | 3 | 4;

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
