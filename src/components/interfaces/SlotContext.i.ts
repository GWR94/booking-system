import { Dayjs } from 'dayjs';
import { SessionTimes } from '../../pages/Booking';

export type Bays = 1 | 2 | 3 | 4 | 5;

export interface SlotsContextType {
	selectedDate: Dayjs;
	selectedSession: SessionTimes;
	selectedBay: Bays;
	setSelectedBay: (bay: Bays) => void;
	setSelectedDate: (date: Dayjs) => void;
	setSelectedSession: (session: SessionTimes) => void;
	isLoading: boolean;
	groupedTimeSlots: GroupedTimeSlots;
}

export interface SlotsProviderProps {
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
}

export interface GroupedTimeSlots {
	[key: string]: GroupedSlot[];
}
