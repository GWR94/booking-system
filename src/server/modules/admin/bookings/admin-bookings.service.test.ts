import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockBookingFindMany = vi.fn();
const mockBookingCount = vi.fn();
const mockBookingFindUnique = vi.fn();
const mockBookingUpdate = vi.fn();
const mockBookingDelete = vi.fn();
const mockBookingCreate = vi.fn();
const mockSlotFindMany = vi.fn();
const mockSlotUpdate = vi.fn();
const mockSlotUpdateMany = vi.fn();

vi.mock('@db', () => ({
	db: {
		booking: {
			findMany: (...args: unknown[]) => mockBookingFindMany(...args),
			count: (...args: unknown[]) => mockBookingCount(...args),
			findUnique: (...args: unknown[]) => mockBookingFindUnique(...args),
			update: (...args: unknown[]) => mockBookingUpdate(...args),
			delete: (...args: unknown[]) => mockBookingDelete(...args),
			create: (...args: unknown[]) => mockBookingCreate(...args),
		},
		slot: {
			findMany: (...args: unknown[]) => mockSlotFindMany(...args),
			update: (...args: unknown[]) => mockSlotUpdate(...args),
			updateMany: (...args: unknown[]) => mockSlotUpdateMany(...args),
		},
	},
}));

import { AdminBookingsService } from './admin-bookings.service';

describe('AdminBookingsService', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('getAllBookings', () => {
		it('should return data and pagination with default page and limit', async () => {
			const mockBookings = [{ id: 1, status: 'confirmed', user: {}, slots: [] }];
			mockBookingFindMany.mockResolvedValue(mockBookings);
			mockBookingCount.mockResolvedValue(1);

			const result = await AdminBookingsService.getAllBookings({});

			expect(result).toEqual({
				data: mockBookings,
				pagination: {
					total: 1,
					page: 1,
					limit: 10,
					totalPages: 1,
				},
			});
			expect(mockBookingFindMany).toHaveBeenCalledWith(
				expect.objectContaining({
					where: {},
					skip: 0,
					take: 10,
					orderBy: { bookingTime: 'desc' },
					include: expect.objectContaining({
						user: true,
						slots: expect.any(Object),
					}),
				}),
			);
			expect(mockBookingCount).toHaveBeenCalledWith({ where: {} });
		});

		it('should apply custom page and limit', async () => {
			mockBookingFindMany.mockResolvedValue([]);
			mockBookingCount.mockResolvedValue(25);

			const result = await AdminBookingsService.getAllBookings({
				page: 2,
				limit: 5,
			});

			expect(result.pagination).toEqual({
				total: 25,
				page: 2,
				limit: 5,
				totalPages: 5,
			});
			expect(mockBookingFindMany).toHaveBeenCalledWith(
				expect.objectContaining({
					skip: 5,
					take: 5,
				}),
			);
		});

		it('should build search filter for name, email and status when search is non-numeric', async () => {
			mockBookingFindMany.mockResolvedValue([]);
			mockBookingCount.mockResolvedValue(0);

			await AdminBookingsService.getAllBookings({ search: 'john' });

			expect(mockBookingFindMany).toHaveBeenCalledWith(
				expect.objectContaining({
					where: {
						OR: [
							{ user: { name: { contains: 'john', mode: 'insensitive' } } },
							{ user: { email: { contains: 'john', mode: 'insensitive' } } },
							{ status: { contains: 'john', mode: 'insensitive' } },
						],
					},
				}),
			);
		});

		it('should include numeric id in search when search is a number', async () => {
			mockBookingFindMany.mockResolvedValue([]);
			mockBookingCount.mockResolvedValue(0);

			await AdminBookingsService.getAllBookings({ search: '42' });

			expect(mockBookingFindMany).toHaveBeenCalledWith(
				expect.objectContaining({
					where: {
						OR: [
							{ user: { name: { contains: '42', mode: 'insensitive' } } },
							{ user: { email: { contains: '42', mode: 'insensitive' } } },
							{ status: { contains: '42', mode: 'insensitive' } },
							{ id: 42 },
						],
					},
				}),
			);
		});
	});

	describe('updateBookingStatus', () => {
		it('should update booking status and return message', async () => {
			const mockBooking = { id: 1, status: 'cancelled' };
			mockBookingUpdate.mockResolvedValue(mockBooking);

			const result = await AdminBookingsService.updateBookingStatus(1, 'cancelled');

			expect(result.booking).toEqual(mockBooking);
			expect(result.message).toBe('Booking status updated successfully');
			expect(mockBookingUpdate).toHaveBeenCalledWith({
				where: { id: 1 },
				data: { status: 'cancelled' },
			});
		});
	});

	describe('deleteBooking', () => {
		it('should throw when booking not found', async () => {
			mockBookingFindUnique.mockResolvedValue(null);

			await expect(AdminBookingsService.deleteBooking(999)).rejects.toThrow(
				'Booking not found',
			);
		});

		it('should free slots and delete booking', async () => {
			mockBookingFindUnique.mockResolvedValue({
				id: 1,
				slots: [{ id: 10 }, { id: 11 }],
			});
			mockSlotUpdateMany.mockResolvedValue({ count: 2 });
			mockBookingDelete.mockResolvedValue({});

			const result = await AdminBookingsService.deleteBooking(1);

			expect(result.message).toBe('Booking deleted and slots freed successfully');
			expect(mockSlotUpdateMany).toHaveBeenCalledWith({
				where: { id: { in: [10, 11] } },
				data: { status: 'available' },
			});
			expect(mockBookingDelete).toHaveBeenCalledWith({ where: { id: 1 } });
		});
	});

	describe('createAdminBooking', () => {
		it('should throw when slots not all available', async () => {
			mockSlotFindMany.mockResolvedValue([{ id: 1 }]);

			await expect(
				AdminBookingsService.createAdminBooking(1, [1, 2]),
			).rejects.toThrow(/not available or don't exist/);
		});

		it('should create booking and mark slots booked', async () => {
			const mockBooking = { id: 1, userId: 1, status: 'confirmed - local', slots: [], user: {} };
			mockSlotFindMany.mockResolvedValue([{ id: 1 }, { id: 2 }]);
			mockBookingCreate.mockResolvedValue(mockBooking);
			mockSlotUpdate.mockResolvedValue({});

			const result = await AdminBookingsService.createAdminBooking(1, [1, 2]);

			expect(result.message).toBe('Admin booking created successfully');
			expect(result.booking).toEqual(mockBooking);
			expect(mockBookingCreate).toHaveBeenCalled();
			expect(mockSlotUpdate).toHaveBeenCalledTimes(2);
		});
	});

	describe('extendBooking', () => {
		it('should throw when hours is invalid', async () => {
			await expect(
				AdminBookingsService.extendBooking(1, 3 as any),
			).rejects.toThrow('Invalid hours');
		});

		it('should throw when booking not found', async () => {
			mockBookingFindUnique.mockResolvedValue(null);

			await expect(AdminBookingsService.extendBooking(1, 1)).rejects.toThrow(
				'Booking not found',
			);
		});

		it('should throw when booking has no slots', async () => {
			mockBookingFindUnique.mockResolvedValue({ id: 1, slots: [] });

			await expect(AdminBookingsService.extendBooking(1, 1)).rejects.toThrow(
				'Booking has no slots',
			);
		});

		it('should throw when not enough available slots to extend', async () => {
			mockBookingFindUnique.mockResolvedValue({
				id: 1,
				slots: [
					{
						id: 10,
						bayId: 1,
						startTime: new Date(),
						endTime: new Date('2025-01-15T14:55:00Z'),
					},
				],
			});
			mockSlotFindMany.mockResolvedValue([]);

			await expect(AdminBookingsService.extendBooking(1, 1)).rejects.toThrow(
				'Not enough available slots',
			);
		});

		it('should extend booking by 1 hour when slots available', async () => {
			mockBookingFindUnique.mockResolvedValue({
				id: 1,
				slots: [
					{
						id: 10,
						bayId: 1,
						startTime: new Date(),
						endTime: new Date('2025-01-15T14:55:00Z'),
					},
				],
			});
			mockSlotFindMany.mockResolvedValue([
				{ id: 20, startTime: new Date('2025-01-15T15:00:00Z'), bayId: 1 },
			]);
			mockBookingUpdate.mockResolvedValue({ id: 1, slots: [], user: {} });
			mockSlotUpdateMany.mockResolvedValue({ count: 1 });

			const result = await AdminBookingsService.extendBooking(1, 1);

			expect(result.message).toContain('1 hour');
			expect(mockBookingUpdate).toHaveBeenCalled();
			expect(mockSlotUpdateMany).toHaveBeenCalled();
		});

		it('should throw when available slots are not consecutive', async () => {
			mockBookingFindUnique.mockResolvedValue({
				id: 1,
				slots: [
					{
						id: 10,
						bayId: 1,
						startTime: new Date(),
						endTime: new Date('2025-01-15T14:55:00Z'),
					},
				],
			});
			// Return 1 slot but at wrong time (not 15:00)
			mockSlotFindMany.mockResolvedValue([
				{ id: 20, startTime: new Date('2025-01-15T16:00:00Z'), bayId: 1 },
			]);

			await expect(AdminBookingsService.extendBooking(1, 1)).rejects.toThrow(
				'Available slots are not consecutive',
			);
		});
	});

	describe('checkBookingExtendAvailability', () => {
		it('should return canExtend false when booking not found', async () => {
			mockBookingFindUnique.mockResolvedValue(null);

			await expect(
				AdminBookingsService.checkBookingExtendAvailability(999),
			).rejects.toThrow('Booking not found');
		});

		it('should return canExtend1Hour and canExtend2Hours false when no slots', async () => {
			mockBookingFindUnique.mockResolvedValue({ id: 1, slots: [] });

			const result = await AdminBookingsService.checkBookingExtendAvailability(1);

			expect(result).toEqual({ canExtend1Hour: false, canExtend2Hours: false });
		});

		it('should return canExtend1Hour true when one slot available', async () => {
			mockBookingFindUnique.mockResolvedValue({
				id: 1,
				slots: [
					{
						id: 10,
						bayId: 1,
						startTime: new Date(),
						endTime: new Date('2025-01-15T14:55:00Z'),
					},
				],
			});
			mockSlotFindMany
				.mockResolvedValueOnce([
					{ id: 20, startTime: new Date('2025-01-15T15:00:00Z'), bayId: 1 },
				])
				.mockResolvedValueOnce([]);

			const result = await AdminBookingsService.checkBookingExtendAvailability(1);

			expect(result.canExtend1Hour).toBe(true);
		});

		it('should return canExtend2Hours true when two consecutive slots available', async () => {
			const extendFrom = new Date('2025-01-15T15:00:00Z');
			mockBookingFindUnique.mockResolvedValue({
				id: 1,
				slots: [
					{
						id: 10,
						bayId: 1,
						startTime: new Date(),
						endTime: new Date('2025-01-15T14:55:00Z'),
					},
				],
			});
			mockSlotFindMany
				.mockResolvedValueOnce([
					{ id: 20, startTime: extendFrom, bayId: 1 },
				])
				.mockResolvedValueOnce([
					{ id: 20, startTime: extendFrom, bayId: 1 },
					{ id: 21, startTime: new Date('2025-01-15T16:00:00Z'), bayId: 1 },
				]);

			const result = await AdminBookingsService.checkBookingExtendAvailability(1);

			expect(result.canExtend2Hours).toBe(true);
		});
	});
});
