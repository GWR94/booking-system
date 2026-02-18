import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockTransaction = vi.fn();
const mockBookingFindUnique = vi.fn();
const mockBookingUpdate = vi.fn();

vi.mock('@db', () => ({
	db: {
		$transaction: (...args: unknown[]) => mockTransaction(...args),
		booking: {
			findUnique: (...args: unknown[]) => mockBookingFindUnique(...args),
			update: (...args: unknown[]) => mockBookingUpdate(...args),
		},
	},
}));

const mockGetStripe = vi.fn();
const mockHandleSendEmail = vi.fn();

vi.mock('@lib/stripe', () => ({
	getStripe: () => mockGetStripe(),
}));

vi.mock('@utils/email', () => ({
	handleSendEmail: (...args: unknown[]) => mockHandleSendEmail(...args),
}));

vi.mock('@utils', () => ({
	groupSlotsByBay: (slots: unknown) => slots,
}));

import { BookingService } from './booking.service';

describe('BookingService', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('createBooking', () => {
		it('should create booking for authenticated user with userId and slotIds', async () => {
			const mockBooking = {
				id: 1,
				userId: 10,
				status: 'pending',
				slots: [{ id: 1 }, { id: 2 }],
			};
			let capturedTx: any;
			mockTransaction.mockImplementation(async (cb: (tx: any) => Promise<any>) => {
				capturedTx = {
					user: { upsert: vi.fn() },
					slot: {
						findMany: vi.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]),
						updateMany: vi.fn().mockResolvedValue({ count: 2 }),
					},
					booking: {
						create: vi.fn().mockResolvedValue(mockBooking),
					},
				};
				return cb(capturedTx);
			});

			const result = await BookingService.createBooking({
				userId: 10,
				slotIds: [1, 2],
			});

			expect(result).toEqual(mockBooking);
			expect(mockTransaction).toHaveBeenCalledTimes(1);
			expect(capturedTx.slot.findMany).toHaveBeenCalledWith({
				where: { id: { in: [1, 2] }, status: 'available' },
			});
			expect(capturedTx.booking.create).toHaveBeenCalledWith({
				data: {
					user: { connect: { id: 10 } },
					slots: { connect: [{ id: 1 }, { id: 2 }] },
					status: 'pending',
					paymentId: undefined,
					paymentStatus: undefined,
				},
				include: { slots: true },
			});
			expect(capturedTx.slot.updateMany).toHaveBeenCalledWith({
				where: { id: { in: [1, 2] } },
				data: { status: 'awaiting payment' },
			});
			expect(capturedTx.user.upsert).not.toHaveBeenCalled();
		});

		it('should upsert guest user and create booking when guestInfo is provided', async () => {
			const mockGuestUser = { id: 99, email: 'guest@example.com', name: 'Guest', role: 'guest' };
			const mockBooking = {
				id: 1,
				userId: 99,
				status: 'pending',
				slots: [{ id: 1 }],
			};
			let capturedTx: any;
			mockTransaction.mockImplementation(async (cb: (tx: any) => Promise<any>) => {
				capturedTx = {
					user: {
						upsert: vi.fn().mockResolvedValue(mockGuestUser),
					},
					slot: {
						findMany: vi.fn().mockResolvedValue([{ id: 1 }]),
						updateMany: vi.fn().mockResolvedValue({ count: 1 }),
					},
					booking: {
						create: vi.fn().mockResolvedValue(mockBooking),
					},
				};
				return cb(capturedTx);
			});

			const result = await BookingService.createBooking({
				slotIds: [1],
				guestInfo: {
					name: 'Guest',
					email: 'guest@example.com',
					phone: '07700900123',
				},
			});

			expect(result).toEqual(mockBooking);
			expect(capturedTx.user.upsert).toHaveBeenCalledWith({
				where: { email: 'guest@example.com' },
				update: {
					name: 'Guest',
					phone: '07700900123',
				},
				create: {
					email: 'guest@example.com',
					name: 'Guest',
					phone: '07700900123',
					role: 'guest',
				},
			});
			expect(capturedTx.booking.create).toHaveBeenCalledWith(
				expect.objectContaining({
					data: expect.objectContaining({
						user: { connect: { id: 99 } },
						status: 'pending',
					}),
				}),
			);
		});

		it('should throw when neither userId nor guestInfo provided', async () => {
			mockTransaction.mockImplementation(async (cb: (tx: any) => Promise<any>) => {
				const tx = {
					user: { upsert: vi.fn() },
					slot: { findMany: vi.fn(), updateMany: vi.fn() },
					booking: { create: vi.fn() },
				};
				return cb(tx);
			});

			await expect(
				BookingService.createBooking({ slotIds: [1] }),
			).rejects.toThrow('User ID or guest info must be provided');
		});

		it('should throw when one or more slots do not exist or are not available', async () => {
			mockTransaction.mockImplementation(async (cb: (tx: any) => Promise<any>) => {
				const tx = {
					user: { upsert: vi.fn() },
					slot: {
						findMany: vi.fn().mockResolvedValue([{ id: 1 }]), // only 1 slot, but we requested 2
						updateMany: vi.fn(),
					},
					booking: { create: vi.fn() },
				};
				return cb(tx);
			});

			await expect(
				BookingService.createBooking({ userId: 1, slotIds: [1, 2] }),
			).rejects.toThrow('One or more slots do not exist or have been booked');
		});
	});

	describe('confirmBooking', () => {
		it('should update booking, fetch intent, and send email', async () => {
			const mockUpdate = { id: 1, status: 'confirmed', paymentId: 'pi_1', paymentStatus: 'succeeded' };
			const mockBooking = {
				id: 1,
				status: 'confirmed',
				slots: [{ id: 10, bayId: 1 }],
				user: { email: 'user@example.com' },
			};
			mockTransaction.mockImplementation(async (cb: (tx: any) => Promise<any>) => {
				const tx = { booking: { update: vi.fn().mockResolvedValue(mockUpdate) } };
				return cb(tx);
			});
			mockBookingFindUnique.mockResolvedValue(mockBooking);
			mockGetStripe.mockReturnValue({
				paymentIntents: { retrieve: vi.fn().mockResolvedValue({ amount: 2000 }) },
			});
			mockHandleSendEmail.mockResolvedValue(undefined);

			const result = await BookingService.confirmBooking(1, 'pi_1', 'succeeded');

			expect(result).toEqual(mockBooking);
			expect(mockHandleSendEmail).toHaveBeenCalledWith(
				expect.objectContaining({
					recipientEmail: 'user@example.com',
					templateName: 'confirmation',
				}),
			);
		});

		it('should throw when booking not found after update', async () => {
			mockTransaction.mockImplementation(async (cb: (tx: any) => Promise<any>) => {
				const tx = { booking: { update: vi.fn().mockResolvedValue({ id: 1 }) } };
				return cb(tx);
			});
			mockBookingFindUnique.mockResolvedValue(null);

			await expect(
				BookingService.confirmBooking(1, 'pi_1', 'succeeded'),
			).rejects.toThrow('Booking not found');
		});
	});

	describe('handleFailedPayment', () => {
		it('should set status to failed and release slots', async () => {
			const mockBooking = {
				id: 1,
				status: 'failed',
				slots: [{ id: 10 }, { id: 11 }],
			};
			mockTransaction.mockImplementation(async (cb: (tx: any) => Promise<any>) => {
				const tx = {
					booking: {
						update: vi.fn().mockResolvedValue(mockBooking),
					},
					slot: {
						updateMany: vi.fn().mockResolvedValue({ count: 2 }),
					},
				};
				return cb(tx);
			});

			const result = await BookingService.handleFailedPayment(1);

			expect(result).toEqual(mockBooking);
			expect(mockTransaction).toHaveBeenCalled();
		});
	});
});
