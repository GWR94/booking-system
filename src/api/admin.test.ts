import { describe, it, expect, vi, beforeEach } from 'vitest';
import { axios } from '@api/client';
import {
	getAllUsers,
	getAllBookings,
	createAdminBooking,
	createSlot,
	updateSlot,
	deleteSlot,
	getDashboardStats,
	adminUpdateBookingStatus,
	adminDeleteBooking,
	adminExtendBooking,
	adminCheckExtendAvailability,
	blockSlots,
	unblockSlots,
	getSlots,
	updateUserDetails,
	resetUserPassword,
} from './admin';

vi.mock('@api/client', () => ({
	axios: {
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn(),
		delete: vi.fn(),
		patch: vi.fn(),
	},
}));

describe('admin api', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('getAllUsers should call GET /api/admin/users', async () => {
		const mockUsers = [{ id: 1, name: 'Test User' }];
		(axios.get as any).mockResolvedValue({ data: mockUsers });

		const result = await getAllUsers();

		expect(axios.get).toHaveBeenCalledWith('/api/admin/users');
		expect(result).toEqual(mockUsers);
	});

	it('getAllBookings should call GET /api/admin/bookings', async () => {
		const mockBookings = [{ id: 1, slotId: 10 }];
		(axios.get as any).mockResolvedValue({ data: mockBookings });

		const result = await getAllBookings();

		expect(axios.get).toHaveBeenCalledWith('/api/admin/bookings', {
			params: undefined,
		});
		expect(result).toEqual(mockBookings);
	});

	it('createAdminBooking should call POST /api/admin/bookings/local-book', async () => {
		const slotIds = [1, 2];
		const mockResponse = { success: true };
		(axios.post as any).mockResolvedValue({ data: mockResponse });

		const result = await createAdminBooking(slotIds);

		expect(axios.post).toHaveBeenCalledWith('/api/admin/bookings/local-book', {
			slotIds,
		});
		expect(result).toEqual(mockResponse);
	});

	it('createSlot should call POST /api/admin/slots', async () => {
		const slotData = { startTime: '2023-01-01T10:00:00Z' };
		const mockResponse = { id: 1, ...slotData };
		(axios.post as any).mockResolvedValue({ data: mockResponse });

		const result = await createSlot(slotData);

		expect(axios.post).toHaveBeenCalledWith('/api/admin/slots', slotData);
		expect(result).toEqual(mockResponse);
	});

	it('updateSlot should call PUT /api/admin/slots/:id', async () => {
		const id = 1;
		const slotData = { status: 'booked' };
		const mockResponse = { id, ...slotData };
		(axios.put as any).mockResolvedValue({ data: mockResponse });

		const result = await updateSlot(id, slotData);

		expect(axios.put).toHaveBeenCalledWith(`/api/admin/slots/${id}`, slotData);
		expect(result).toEqual(mockResponse);
	});

	it('deleteSlot should call DELETE /api/admin/slots/:id', async () => {
		const id = 1;
		const mockResponse = { success: true };
		(axios.delete as any).mockResolvedValue({ data: mockResponse });

		const result = await deleteSlot(id);

		expect(axios.delete).toHaveBeenCalledWith(`/api/admin/slots/${id}`);
		expect(result).toEqual(mockResponse);
	});

	it('getDashboardStats should call GET /api/admin/dashboard-stats', async () => {
		const mockStats = { totalUsers: 10, totalBookings: 50 };
		(axios.get as any).mockResolvedValue({ data: mockStats });

		const result = await getDashboardStats();

		expect(axios.get).toHaveBeenCalledWith('/api/admin/dashboard-stats');
		expect(result).toEqual(mockStats);
	});

	it('adminUpdateBookingStatus should call PATCH .../status', async () => {
		const id = 1;
		const status = 'cancelled';
		(axios.patch as any).mockResolvedValue({ data: { id, status } });

		const result = await adminUpdateBookingStatus(id, status);

		expect(axios.patch).toHaveBeenCalledWith(
			`/api/admin/bookings/${id}/status`,
			{ status },
		);
		expect(result).toEqual({ id, status });
	});

	it('adminDeleteBooking should call DELETE /api/admin/bookings/:id', async () => {
		const id = 1;
		(axios.delete as any).mockResolvedValue({ data: { success: true } });

		const result = await adminDeleteBooking(id);

		expect(axios.delete).toHaveBeenCalledWith(
			`/api/admin/bookings/${id}`,
		);
		expect(result).toEqual({ success: true });
	});

	it('adminExtendBooking should call PATCH .../extend', async () => {
		const id = 1;
		const hours = 2 as const;
		(axios.patch as any).mockResolvedValue({ data: { id, hours } });

		const result = await adminExtendBooking(id, hours);

		expect(axios.patch).toHaveBeenCalledWith(
			`/api/admin/bookings/${id}/extend`,
			{ hours },
		);
		expect(result).toEqual({ id, hours });
	});

	it('adminCheckExtendAvailability should call GET .../extend-availability', async () => {
		const id = 1;
		(axios.get as any).mockResolvedValue({ data: { canExtend: true } });

		const result = await adminCheckExtendAvailability(id);

		expect(axios.get).toHaveBeenCalledWith(
			`/api/admin/bookings/${id}/extend-availability`,
		);
		expect(result).toEqual({ canExtend: true });
	});

	it('blockSlots should call POST /api/admin/slots/block', async () => {
		const data = {
			startTime: '2024-01-01T09:00:00Z',
			endTime: '2024-01-01T17:00:00Z',
			bayId: 1,
		};
		(axios.post as any).mockResolvedValue({ data: { blocked: true } });

		const result = await blockSlots(data);

		expect(axios.post).toHaveBeenCalledWith('/api/admin/slots/block', data);
		expect(result).toEqual({ blocked: true });
	});

	it('unblockSlots should call POST /api/admin/slots/unblock', async () => {
		const data = {
			startTime: '2024-01-01T09:00:00Z',
			endTime: '2024-01-01T17:00:00Z',
		};
		(axios.post as any).mockResolvedValue({ data: { unblocked: true } });

		const result = await unblockSlots(data);

		expect(axios.post).toHaveBeenCalledWith(
			'/api/admin/slots/unblock',
			data,
		);
		expect(result).toEqual({ unblocked: true });
	});

	it('getSlots should call GET /api/admin/slots with date only when no bayId', async () => {
		const date = '2024-01-15';
		(axios.get as any).mockResolvedValue({ data: [] });

		const result = await getSlots(date);

		expect(axios.get).toHaveBeenCalledWith('/api/admin/slots', {
			params: { date },
		});
		expect(result).toEqual([]);
	});

	it('getSlots should include bayId in params when provided', async () => {
		const date = '2024-01-15';
		const bayId = 2;
		(axios.get as any).mockResolvedValue({ data: [] });

		const result = await getSlots(date, bayId);

		expect(axios.get).toHaveBeenCalledWith('/api/admin/slots', {
			params: { date, bayId },
		});
		expect(result).toEqual([]);
	});

	it('updateUserDetails should call PUT /api/admin/users/:id', async () => {
		const id = 1;
		const data = { name: 'New Name' };
		(axios.put as any).mockResolvedValue({ data: { id, ...data } });

		const result = await updateUserDetails(id, data);

		expect(axios.put).toHaveBeenCalledWith(
			`/api/admin/users/${id}`,
			data,
		);
		expect(result).toEqual({ id, ...data });
	});

	it('resetUserPassword should call POST .../reset-password', async () => {
		const id = 1;
		(axios.post as any).mockResolvedValue({ data: { success: true } });

		const result = await resetUserPassword(id);

		expect(axios.post).toHaveBeenCalledWith(
			`/api/admin/users/${id}/reset-password`,
		);
		expect(result).toEqual({ success: true });
	});
});
