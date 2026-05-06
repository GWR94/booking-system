export type AdminBookingsServiceLike = {
	getAllBookings: (params: {
		page?: number;
		limit?: number;
		search?: string | null;
	}) => Promise<any>;
	extendBooking: (bookingId: number, hours: number) => Promise<any>;
	checkBookingExtendAvailability: (bookingId: number) => Promise<any>;
	updateBookingStatus: (bookingId: number, status: string) => Promise<any>;
	deleteBooking: (bookingId: number) => Promise<any>;
	createAdminBooking: (userId: number, slotIds: number[]) => Promise<any>;
};

export type Ok<T> = { ok: true; value: T };
export type Err = { ok: false; status: number; message: string; code?: string; details?: any };

export type AdminBookingLifecycle = {
	getAllBookings: (args: {
		user: { role: string };
		page?: number;
		limit?: number;
		search?: string | null;
	}) => Promise<Ok<any> | Err>;
	extendBooking: (args: {
		user: { role: string };
		bookingId: number;
		hours: number;
	}) => Promise<Ok<any> | Err>;
	checkBookingExtendAvailability: (args: {
		user: { role: string };
		bookingId: number;
	}) => Promise<Ok<any> | Err>;
	updateBookingStatus: (args: {
		user: { role: string };
		bookingId: number;
		status: string;
	}) => Promise<Ok<any> | Err>;
	deleteBooking: (args: {
		user: { role: string };
		bookingId: number;
	}) => Promise<Ok<any> | Err>;
	createLocalBooking: (args: {
		user: { role: string };
		userId: number;
		slotIds: number[];
	}) => Promise<Ok<any> | Err>;
};

