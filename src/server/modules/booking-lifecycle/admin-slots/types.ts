import type { Dayjs } from 'dayjs';

export type Ok<T> = { ok: true; value: T };
export type Err = { ok: false; status: number; error: string; code?: string };

export type AdminSlotsLifecycle = {
	getSlots: (args: {
		user: { role: string };
		date: string;
		bayId?: string;
	}) => Promise<Ok<any> | Err>;

	createSlot: (args: {
		user: { role: string };
		startTime: Dayjs;
		endTime: Dayjs;
		status?: string;
		bay: number;
	}) => Promise<Ok<any> | Err>;

	updateSlot: (args: {
		user: { role: string };
		slotId: number;
		startTime: Dayjs;
		endTime: Dayjs;
		status?: string;
		bay: number;
	}) => Promise<Ok<any> | Err>;

	deleteSlot: (args: { user: { role: string }; slotId: number }) => Promise<Ok<any> | Err>;

	blockSlots: (args: {
		user: { role: string };
		startTime: Dayjs;
		endTime: Dayjs;
		bayId?: number;
	}) => Promise<Ok<any> | Err>;

	unblockSlots: (args: {
		user: { role: string };
		startTime: Dayjs;
		endTime: Dayjs;
		bayId?: number;
	}) => Promise<Ok<any> | Err>;
};

