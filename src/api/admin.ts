import { axios } from '@api/client';
import type { Booking } from '@features/booking/components';
import type { User } from '@features/auth/components/types';

export const getAllUsers = async (): Promise<User[]> => {
	const response = await axios.get('/api/admin/users');
	return response.data;
};

export const getAllBookings = async (params?: {
	page?: number;
	limit?: number;
	search?: string;
}) => {
	const response = await axios.get('/api/admin/bookings', { params });
	return response.data;
};

export const createAdminBooking = async (slotIds: number[]) => {
	const response = await axios.post('/api/admin/bookings/local-book', {
		slotIds,
	});
	return response.data;
};

export const createSlot = async (slotData: any) => {
	const response = await axios.post('/api/admin/slots', slotData);
	return response.data;
};

export const updateSlot = async (id: number, slotData: any) => {
	const response = await axios.put(`/api/admin/slots/${id}`, slotData);
	return response.data;
};

export const deleteSlot = async (id: number) => {
	const response = await axios.delete(`/api/admin/slots/${id}`);
	return response.data;
};

export const getDashboardStats = async () => {
	const response = await axios.get('/api/admin/dashboard-stats');
	return response.data;
};

export const adminUpdateBookingStatus = async (id: number, status: string) => {
	const response = await axios.patch(`/api/admin/bookings/${id}/status`, {
		status,
	});
	return response.data;
};

export const adminDeleteBooking = async (id: number) => {
	const response = await axios.delete(`/api/admin/bookings/${id}`);
	return response.data;
};

export const adminExtendBooking = async (id: number, hours: 1 | 2) => {
	const response = await axios.patch(`/api/admin/bookings/${id}/extend`, {
		hours,
	});
	return response.data;
};

export const adminCheckExtendAvailability = async (id: number) => {
	const response = await axios.get(
		`/api/admin/bookings/${id}/extend-availability`,
	);
	return response.data;
};

export const blockSlots = async (data: {
	startTime: string;
	endTime: string;
	bayId?: number;
}) => {
	const response = await axios.post('/api/admin/slots/block', data);
	return response.data;
};

export const unblockSlots = async (data: {
	startTime: string;
	endTime: string;
	bayId?: number;
}) => {
	const response = await axios.post('/api/admin/slots/unblock', data);
	return response.data;
};

export const getSlots = async (date: string, bayId?: number) => {
	const params: any = { date };
	if (bayId) params.bayId = bayId;
	const response = await axios.get('/api/admin/slots', { params });
	return response.data;
};

export const updateUserDetails = async (id: number, data: any) => {
	const response = await axios.put(`/api/admin/users/${id}`, data);
	return response.data;
};

export const resetUserPassword = async (id: number) => {
	const response = await axios.post(`/api/admin/users/${id}/reset-password`);
	return response.data;
};
