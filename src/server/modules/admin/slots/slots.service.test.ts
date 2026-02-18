import { describe, it, expect, vi, beforeEach } from 'vitest';
import dayjs from 'dayjs';

const mockSlotCreate = vi.fn();
const mockSlotUpdate = vi.fn();
const mockSlotDelete = vi.fn();
const mockSlotFindMany = vi.fn();
const mockSlotUpdateMany = vi.fn();

vi.mock('@db', () => ({
	db: {
		slot: {
			create: (...args: unknown[]) => mockSlotCreate(...args),
			update: (...args: unknown[]) => mockSlotUpdate(...args),
			delete: (...args: unknown[]) => mockSlotDelete(...args),
			findMany: (...args: unknown[]) => mockSlotFindMany(...args),
			updateMany: (...args: unknown[]) => mockSlotUpdateMany(...args),
		},
	},
}));

import { AdminSlotsService } from './slots.service';

describe('AdminSlotsService', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('createSlot', () => {
		it('should create a slot with startTime, endTime, status and bay', async () => {
			const mockSlot = { id: 1, startTime: new Date(), endTime: new Date(), status: 'available', bayId: 1 };
			mockSlotCreate.mockResolvedValue(mockSlot);

			const result = await AdminSlotsService.createSlot({
				startTime: dayjs('2025-01-15T09:00:00Z'),
				endTime: dayjs('2025-01-15T10:00:00Z'),
				status: 'available',
				bay: 1,
			});

			expect(result.message).toBe('Slot created successfully');
			expect(result.slot).toEqual(mockSlot);
			expect(mockSlotCreate).toHaveBeenCalledWith({
				data: {
					startTime: new Date('2025-01-15T09:00:00Z'),
					endTime: new Date('2025-01-15T10:00:00Z'),
					status: 'available',
					bayId: 1,
				},
			});
		});
	});

	describe('updateSlot', () => {
		it('should update slot when startTime, endTime, status and bay are provided', async () => {
			const mockSlot = { id: 1, status: 'maintenance' };
			mockSlotUpdate.mockResolvedValue(mockSlot);

			const result = await AdminSlotsService.updateSlot(1, {
				startTime: dayjs('2025-01-15T10:00:00Z'),
				endTime: dayjs('2025-01-15T11:00:00Z'),
				status: 'maintenance',
				bay: 1,
			});

			expect(result.message).toBe('Slot updated successfully');
			expect(mockSlotUpdate).toHaveBeenCalledWith({
				where: { id: 1 },
				data: {
					startTime: new Date('2025-01-15T10:00:00Z'),
					endTime: new Date('2025-01-15T11:00:00Z'),
					status: 'maintenance',
					bayId: 1,
				},
			});
		});

		it('should pass bayId when bay is provided', async () => {
			mockSlotUpdate.mockResolvedValue({ id: 1, bayId: 2 });
			await AdminSlotsService.updateSlot(1, {
				startTime: dayjs('2025-01-15T10:00:00Z'),
				endTime: dayjs('2025-01-15T11:00:00Z'),
				status: 'available',
				bay: 2,
			});
			expect(mockSlotUpdate).toHaveBeenCalledWith({
				where: { id: 1 },
				data: {
					startTime: new Date('2025-01-15T10:00:00Z'),
					endTime: new Date('2025-01-15T11:00:00Z'),
					status: 'available',
					bayId: 2,
				},
			});
		});
	});

	describe('deleteSlot', () => {
		it('should delete slot by id', async () => {
			mockSlotDelete.mockResolvedValue(undefined);

			const result = await AdminSlotsService.deleteSlot(5);

			expect(result.message).toBe('Slot deleted successfully');
			expect(mockSlotDelete).toHaveBeenCalledWith({ where: { id: 5 } });
		});
	});

	describe('blockSlots', () => {
		it('should update many slots to maintenance within time range', async () => {
			mockSlotUpdateMany.mockResolvedValue({ count: 3 });

			const result = await AdminSlotsService.blockSlots({
				startTime: dayjs('2025-01-15T09:00:00Z'),
				endTime: dayjs('2025-01-15T17:00:00Z'),
			});

			expect(result.message).toBe('Successfully blocked 3 slots');
			expect(result.count).toBe(3);
			expect(mockSlotUpdateMany).toHaveBeenCalledWith({
				where: {
					startTime: { gte: new Date('2025-01-15T09:00:00Z') },
					endTime: { lte: new Date('2025-01-15T17:00:00Z') },
					status: 'available',
				},
				data: { status: 'maintenance' },
			});
		});

		it('should filter by bayId when provided', async () => {
			mockSlotUpdateMany.mockResolvedValue({ count: 2 });

			await AdminSlotsService.blockSlots({
				startTime: dayjs('2025-01-15T09:00:00Z'),
				endTime: dayjs('2025-01-15T17:00:00Z'),
				bayId: 2,
			});

			expect(mockSlotUpdateMany).toHaveBeenCalledWith(
				expect.objectContaining({
					where: expect.objectContaining({
						bayId: 2,
						status: 'available',
					}),
				}),
			);
		});

		it('should throw on invalid date format', async () => {
			await expect(
				AdminSlotsService.blockSlots({
					startTime: dayjs('invalid'),
					endTime: dayjs('2025-01-15T17:00:00Z'),
				}),
			).rejects.toThrow('Invalid date format');
			expect(mockSlotUpdateMany).not.toHaveBeenCalled();
		});
	});

	describe('unblockSlots', () => {
		it('should update maintenance slots to available within time range', async () => {
			mockSlotUpdateMany.mockResolvedValue({ count: 2 });

			const result = await AdminSlotsService.unblockSlots({
				startTime: dayjs('2025-01-15T09:00:00Z'),
				endTime: dayjs('2025-01-15T17:00:00Z'),
			});

			expect(result.message).toBe('Successfully unblocked 2 slots');
			expect(result.count).toBe(2);
			expect(mockSlotUpdateMany).toHaveBeenCalledWith({
				where: {
					startTime: { gte: new Date('2025-01-15T09:00:00Z') },
					endTime: { lte: new Date('2025-01-15T17:00:00Z') },
					status: 'maintenance',
				},
				data: { status: 'available' },
			});
		});

		it('should throw on invalid date format', async () => {
			await expect(
				AdminSlotsService.unblockSlots({
					startTime: dayjs('2025-01-15T09:00:00Z'),
					endTime: dayjs('not-a-date'),
				}),
			).rejects.toThrow('Invalid date format');
		});

		it('should filter by bayId when provided', async () => {
			mockSlotUpdateMany.mockResolvedValue({ count: 1 });

			await AdminSlotsService.unblockSlots({
				startTime: dayjs('2025-01-15T09:00:00Z'),
				endTime: dayjs('2025-01-15T17:00:00Z'),
				bayId: 2,
			});

			expect(mockSlotUpdateMany).toHaveBeenCalledWith({
				where: {
					startTime: { gte: new Date('2025-01-15T09:00:00Z') },
					endTime: { lte: new Date('2025-01-15T17:00:00Z') },
					status: 'maintenance',
					bayId: 2,
				},
				data: { status: 'available' },
			});
		});
	});

	describe('getAdminSlots', () => {
		it('should throw when date is not provided', async () => {
			await expect(
				AdminSlotsService.getAdminSlots({ date: '' }),
			).rejects.toThrow('Date is required');
			expect(mockSlotFindMany).not.toHaveBeenCalled();
		});

		it('should return slots for the given date with bay included', async () => {
			const mockSlots = [{ id: 1, startTime: new Date(), bay: { id: 1 } }];
			mockSlotFindMany.mockResolvedValue(mockSlots);

			const result = await AdminSlotsService.getAdminSlots({
				date: '2025-01-15',
			});

			expect(result).toEqual(mockSlots);
			expect(mockSlotFindMany).toHaveBeenCalledWith({
				where: {
					startTime: {
						gte: expect.any(Date),
						lte: expect.any(Date),
					},
				},
				include: { bay: true },
				orderBy: { startTime: 'asc' },
			});
		});

		it('should filter by bayId when provided', async () => {
			mockSlotFindMany.mockResolvedValue([]);

			await AdminSlotsService.getAdminSlots({
				date: '2025-01-15',
				bayId: '2',
			});

			expect(mockSlotFindMany).toHaveBeenCalledWith(
				expect.objectContaining({
					where: expect.objectContaining({
						bayId: 2,
					}),
				}),
			);
		});
	});
});
