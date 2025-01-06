import { Dayjs } from 'dayjs';

export interface Booking {
	id: number;
	userId: number;
	slotId: number;
	bookingTime: Dayjs;
	status: StatusType;
	slot: iSlot;
}

export type StatusType = 'available' | 'booked' | 'unavailable';

export interface iSlot {
	id: number;
	startTime: Dayjs;
	endTime: Dayjs;
	status: StatusType;
	bookings: Booking[];
	slots: number[];
	bayId: number;
}
