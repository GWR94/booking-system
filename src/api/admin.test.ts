import { describe, it, expect, vi, beforeEach } from 'vitest';
import { axios } from '@api/client';
import {
	getAllUsers,
	getAllBookings,
	createAdminBooking,
	createSlot,
	updateSlot,
	deleteSlot,
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
});
