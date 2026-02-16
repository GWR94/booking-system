import { db } from '@db';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';

export class AdminSlotsService {
	/**
	 * Create a new slot
	 */
	static async createSlot(data: {
		startTime: string;
		endTime: string;
		status: string;
		bay: number;
	}) {
		const slot = await db.slot.create({
			data: {
				startTime: new Date(data.startTime),
				endTime: new Date(data.endTime),
				status: data.status,
				bayId: data.bay as number,
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
			startTime?: string;
			endTime?: string;
			status?: string;
			bay?: { id: number };
		},
	) {
		if (!data.startTime || !data.endTime || !data.status) {
			throw new Error('Invalid startTime, endTime or status');
		}

		const slot = await db.slot.update({
			where: { id: slotId },
			data: {
				startTime: new Date(data.startTime),
				endTime: new Date(data.endTime),
				status: data.status,
				bayId: data.bay?.id,
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
		startTime: string;
		endTime: string;
		bayId?: number;
	}) {
		const start = new Date(data.startTime);
		const end = new Date(data.endTime);

		// Validate dates
		if (isNaN(start.getTime()) || isNaN(end.getTime())) {
			throw new Error('Invalid date format');
		}

		const whereClause: Prisma.SlotWhereInput = {
			startTime: {
				gte: start,
			},
			endTime: {
				lte: end,
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
		startTime: string;
		endTime: string;
		bayId?: number;
	}) {
		const start = new Date(data.startTime);
		const end = new Date(data.endTime);

		if (isNaN(start.getTime()) || isNaN(end.getTime())) {
			throw new Error('Invalid date format');
		}

		const whereClause: any = {
			startTime: {
				gte: start,
			},
			endTime: {
				lte: end,
			},
			status: 'maintenance',
			// Only unblock maintenance slots
		};

		if (data.bayId) {
			whereClause.bayId = parseInt(data.bayId.toString(), 10);
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
			whereClause.bayId = parseInt(params.bayId, 10);
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
