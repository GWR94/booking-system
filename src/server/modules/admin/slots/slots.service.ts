import { db } from '@db';
import { Prisma } from '@prisma/client';
import dayjs, { type Dayjs } from 'dayjs';

export class AdminSlotsService {
	/**
	 * Create a new slot
	 */
	static async createSlot(data: {
		startTime: Dayjs;
		endTime: Dayjs;
		status: string;
		bay: number;
	}) {
		const slot = await db.slot.create({
			data: {
				startTime: data.startTime.toDate(),
				endTime: data.endTime.toDate(),
				status: data.status,
				bayId: data.bay,
			},
		});

		return { message: 'Slot created successfully', slot };
	}

	/**
	 * Update an existing slot
	 */
	static async updateSlot(
		slotId: number,
		data: {
			startTime: Dayjs;
			endTime: Dayjs;
			status: string;
			bay: number;
		},
	) {
		const slot = await db.slot.update({
			where: { id: slotId },
			data: {
				startTime: data.startTime.toDate(),
				endTime: data.endTime.toDate(),
				status: data.status,
				bayId: data.bay,
			},
		});

		return { message: 'Slot updated successfully', slot };
	}

	/**
	 * Delete a slot
	 */
	static async deleteSlot(slotId: number) {
		await db.slot.delete({
			where: { id: slotId },
		});
		return { message: 'Slot deleted successfully' };
	}

	/**
	 * Block slots within a time range (set to maintenance)
	 */
	static async blockSlots(data: {
		startTime: Dayjs;
		endTime: Dayjs;
		bayId?: number;
	}) {
		const start = data.startTime;
		const end = data.endTime;

		if (!start.isValid() || !end.isValid()) {
			throw new Error('Invalid date format');
		}

		const whereClause: Prisma.SlotWhereInput = {
			startTime: {
				gte: start.toDate(),
			},
			endTime: {
				lte: end.toDate(),
			},
			// Only block available slots to prevent overriding bookings
			status: 'available',
		};

		if (data.bayId) {
			whereClause.bayId = Number(data.bayId);
		}

		const updated = await db.slot.updateMany({
			where: whereClause,
			data: {
				status: 'maintenance',
			},
		});

		return {
			message: `Successfully blocked ${updated.count} slots`,
			count: updated.count,
		};
	}

	/**
	 * Unblock slots within a time range (set to available)
	 */
	static async unblockSlots(data: {
		startTime: Dayjs;
		endTime: Dayjs;
		bayId?: number;
	}) {
		const start = data.startTime;
		const end = data.endTime;

		if (!start.isValid() || !end.isValid()) {
			throw new Error('Invalid date format');
		}

		const whereClause: Prisma.SlotWhereInput = {
			startTime: {
				gte: start.toDate(),
			},
			endTime: {
				lte: end.toDate(),
			},
			status: 'maintenance',
		};

		if (data.bayId !== undefined) {
			whereClause.bayId = data.bayId;
		}

		const updated = await db.slot.updateMany({
			where: whereClause,
			data: {
				status: 'available',
			},
		});

		return {
			message: `Successfully unblocked ${updated.count} slots`,
			count: updated.count,
		};
	}

	/**
	 * Get slots for a specific date and optionally filter by bay
	 */
	static async getAdminSlots(params: { date: string; bayId?: string }) {
		if (!params.date) {
			throw new Error('Date is required');
		}

		const startOfDay = dayjs(params.date).startOf('day').toDate();
		const endOfDay = dayjs(params.date).endOf('day').toDate();

		const whereClause: any = {
			startTime: {
				gte: startOfDay,
				lte: endOfDay,
			},
		};

		if (params.bayId) {
			whereClause.bayId = Number(params.bayId);
		}

		const slots = await db.slot.findMany({
			where: whereClause,
			include: {
				bay: true,
			},
			orderBy: {
				startTime: 'asc',
			},
		});

		return slots;
	}
}
