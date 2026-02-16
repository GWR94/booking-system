import { db } from '@db';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';

export class AdminBookingsService {
	/**
	 * Get all bookings with pagination and search
	 */
	static async getAllBookings(params: {
		page?: number;
		limit?: number;
		search?: string;
	}) {
		const page = params.page || 1;
		const limit = params.limit || 10;
		const search = params.search || '';
		const skip = (page - 1) * limit;

		const where: Prisma.BookingWhereInput = {};

		if (search) {
			where.OR = [
				{ user: { name: { contains: search, mode: 'insensitive' } } },
				{ user: { email: { contains: search, mode: 'insensitive' } } },
				{ status: { contains: search, mode: 'insensitive' } },
			];
			const searchId = parseInt(search);
			if (!isNaN(searchId)) {
				where.OR.push({ id: searchId });
			}
		}

		const [bookings, total] = await Promise.all([
			db.booking.findMany({
				where,
				include: {
					user: true,
					slots: {
						include: {
							bay: true,
						},
					},
				},
				orderBy: { bookingTime: 'desc' },
				skip,
				take: limit,
			}),
			db.booking.count({ where }),
		]);

		return {
			data: bookings,
			pagination: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			},
		};
	}

	/**
	 * Update booking status
	 */
	static async updateBookingStatus(bookingId: number, status: string) {
		const booking = await db.booking.update({
			where: { id: bookingId },
			data: { status },
		});
		return { message: 'Booking status updated successfully', booking };
	}

	/**
	 * Delete a booking and free up associated slots
	 */
	static async deleteBooking(bookingId: number) {
		// Get associated slots
		const booking = await db.booking.findUnique({
			where: { id: bookingId },
			include: { slots: true },
		});

		if (!booking) {
			throw new Error('Booking not found');
		}

		// Free up slots
		const slotIds = booking.slots.map((s) => s.id);
		if (slotIds.length > 0) {
			await db.slot.updateMany({
				where: { id: { in: slotIds } },
				data: { status: 'available' },
			});
		}

		// Delete booking
		await db.booking.delete({
			where: { id: bookingId },
		});

		return { message: 'Booking deleted and slots freed successfully' };
	}

	/**
	 * Create an admin booking (local booking without payment)
	 */
	static async createAdminBooking(userId: number, slotIds: number[]) {
		// Verify all slots exist and are available
		const slots = await db.slot.findMany({
			where: {
				id: {
					in: slotIds,
				},
				status: 'available',
			},
		});

		if (slots.length !== slotIds.length) {
			const unavailableSlotIds = slotIds.filter(
				(id: number) => !slots.some((slot) => slot.id === id),
			);
			throw new Error(
				`The following slots are not available or don't exist: ${unavailableSlotIds.join(', ')}`,
			);
		}

		// Create booking with connected slots
		const booking = await db.booking.create({
			data: {
				user: {
					connect: { id: userId },
				},
				slots: {
					connect: slotIds.map((id: number) => ({ id })),
				},
				status: 'confirmed - local',
			},
			include: {
				slots: true,
				user: true,
			},
		});

		// Update all slots to booked status individually
		for (const slotId of slotIds) {
			await db.slot.update({
				where: { id: slotId },
				data: { status: 'booked' },
			});
		}

		return {
			message: 'Admin booking created successfully',
			booking,
		};
	}

	/**
	 * Extend a booking by 1 or 2 hours
	 */
	static async extendBooking(bookingId: number, hours: number) {
		// Validate hours parameter
		if (hours !== 1 && hours !== 2) {
			throw new Error('Invalid hours parameter. Must be 1 or 2.');
		}

		// Get the booking with its slots
		const booking = await db.booking.findUnique({
			where: { id: bookingId },
			include: {
				slots: {
					include: { bay: true },
					orderBy: { startTime: 'asc' },
				},
			},
		});

		if (!booking) {
			throw new Error('Booking not found');
		}

		if (booking.slots.length === 0) {
			throw new Error('Booking has no slots');
		}

		// Get the last slot to determine where to extend from
		const lastSlot = booking.slots[booking.slots.length - 1];
		const bayId = lastSlot.bayId;
		// Add 5 minutes to account for the gap between slots
		const extendFromTime = dayjs(lastSlot.endTime).add(5, 'minutes');

		// Find the next consecutive available slots for the same bay
		const requiredSlots = await db.slot.findMany({
			where: {
				bayId: bayId,
				status: 'available',
				startTime: {
					gte: extendFromTime.toDate(),
					lt: extendFromTime.add(hours, 'hour').toDate(),
				},
			},
			orderBy: { startTime: 'asc' },
		});

		// Verify we have enough consecutive slots
		if (requiredSlots.length !== hours) {
			throw new Error(
				`Not enough available slots to extend by ${hours} hour(s). Only ${requiredSlots.length} slot(s) available.`,
			);
		}

		// Verify slots are consecutive
		for (let i = 0; i < requiredSlots.length; i++) {
			const expectedStartTime = extendFromTime.add(i, 'hour');
			const slotStartTime = dayjs(requiredSlots[i].startTime);

			if (!slotStartTime.isSame(expectedStartTime)) {
				throw new Error('Available slots are not consecutive');
			}
		}

		// Add the new slots to the booking
		const slotIds = requiredSlots.map((slot) => slot.id);

		const updatedBooking = await db.booking.update({
			where: { id: bookingId },
			data: {
				slots: {
					connect: slotIds.map((id) => ({ id })),
				},
			},
			include: {
				slots: {
					include: { bay: true },
					orderBy: { startTime: 'asc' },
				},
				user: true,
			},
		});

		// Update the new slots to booked status
		await db.slot.updateMany({
			where: { id: { in: slotIds } },
			data: { status: 'booked' },
		});

		return {
			message: `Booking extended by ${hours} hour(s) successfully`,
			booking: updatedBooking,
		};
	}

	/**
	 * Check if a booking can be extended by 1 or 2 hours
	 */
	static async checkBookingExtendAvailability(bookingId: number) {
		// Get the booking with its slots
		const booking = await db.booking.findUnique({
			where: { id: bookingId },
			include: {
				slots: {
					include: { bay: true },
					orderBy: { startTime: 'asc' },
				},
			},
		});

		if (!booking) {
			throw new Error('Booking not found');
		}

		if (booking.slots.length === 0) {
			return { canExtend1Hour: false, canExtend2Hours: false };
		}

		// Get the last slot to determine where to extend from
		const lastSlot = booking.slots[booking.slots.length - 1];
		const bayId = lastSlot.bayId;
		// Add 5 minutes to account for the gap between slots
		const extendFromTime = dayjs(lastSlot.endTime).add(5, 'minutes');

		// Check for 1 hour availability
		const oneHourSlots = await db.slot.findMany({
			where: {
				bayId: bayId,
				status: 'available',
				startTime: {
					gte: extendFromTime.toDate(),
					lt: extendFromTime.add(1, 'hour').toDate(),
				},
			},
			orderBy: { startTime: 'asc' },
		});

		const canExtend1Hour =
			oneHourSlots.length === 1 &&
			dayjs(oneHourSlots[0].startTime).isSame(extendFromTime);

		// Check for 2 hours availability
		const twoHourSlots = await db.slot.findMany({
			where: {
				bayId: bayId,
				status: 'available',
				startTime: {
					gte: extendFromTime.toDate(),
					lt: extendFromTime.add(2, 'hour').toDate(),
				},
			},
			orderBy: { startTime: 'asc' },
		});

		let canExtend2Hours = false;
		if (twoHourSlots.length === 2) {
			const firstSlotTime = dayjs(twoHourSlots[0].startTime);
			const secondSlotTime = dayjs(twoHourSlots[1].startTime);
			const expectedSecondSlotTime = extendFromTime.add(1, 'hour');

			canExtend2Hours =
				firstSlotTime.isSame(extendFromTime) &&
				secondSlotTime.isSame(expectedSecondSlotTime);
		}

		return { canExtend1Hour, canExtend2Hours };
	}
}
