import { AdminSlotsService } from '@modules';

import type { AdminSlotsLifecycle } from './types';
import type { Dayjs } from 'dayjs';

type AdminSlotsServiceLike = {
	getAdminSlots: (params: { date: string; bayId?: string }) => Promise<any>;
	createSlot: (data: {
		startTime: Dayjs;
		endTime: Dayjs;
		status: string;
		bay: number;
	}) => Promise<any>;
	updateSlot: (
		slotId: number,
		data: {
			startTime: Dayjs;
			endTime: Dayjs;
			status: string;
			bay: number;
		},
	) => Promise<any>;
	deleteSlot: (slotId: number) => Promise<any>;
	blockSlots: (data: { startTime: Dayjs; endTime: Dayjs; bayId?: number }) => Promise<any>;
	unblockSlots: (data: { startTime: Dayjs; endTime: Dayjs; bayId?: number }) => Promise<any>;
};

export function makeAdminSlotsLifecycle(deps?: {
	adminSlotsService?: AdminSlotsServiceLike;
}): AdminSlotsLifecycle {
	const adminSlotsService =
		deps?.adminSlotsService ?? (AdminSlotsService as unknown as AdminSlotsServiceLike);

	const requireAdmin = (user: { role: string }) => user.role === 'admin';

	return {
		async getSlots({ user, date, bayId }) {
			if (!requireAdmin(user)) return { ok: false, status: 403, error: 'Forbidden' };

			try {
				const value = await adminSlotsService.getAdminSlots({ date, bayId });
				return { ok: true, value };
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : 'Internal Server Error';
				if (message === 'Date is required') {
					return { ok: false, status: 400, error: message, code: 'VALIDATION_ERROR' };
				}
				return { ok: false, status: 500, error: message };
			}
		},

		async createSlot({ user, startTime, endTime, status, bay }) {
			if (!requireAdmin(user)) return { ok: false, status: 403, error: 'Forbidden' };

			try {
				const value = await adminSlotsService.createSlot({
					startTime,
					endTime,
					status: status ?? 'available',
					bay,
				});
				return { ok: true, value };
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : 'Internal Server Error';
				return { ok: false, status: 500, error: message };
			}
		},

		async updateSlot({ user, slotId, startTime, endTime, status, bay }) {
			if (!requireAdmin(user)) return { ok: false, status: 403, error: 'Forbidden' };

			try {
				const value = await adminSlotsService.updateSlot(slotId, {
					startTime,
					endTime,
					status: status ?? 'available',
					bay,
				});
				return { ok: true, value };
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : 'Internal Server Error';
				if (message.includes('Invalid')) {
					return {
						ok: false,
						status: 400,
						error: message,
						code: 'VALIDATION_ERROR',
					};
				}
				return { ok: false, status: 500, error: message };
			}
		},

		async deleteSlot({ user, slotId }) {
			if (!requireAdmin(user)) return { ok: false, status: 403, error: 'Forbidden' };

			try {
				const value = await adminSlotsService.deleteSlot(slotId);
				return { ok: true, value };
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : 'Internal Server Error';
				return { ok: false, status: 500, error: message };
			}
		},

		async blockSlots({ user, startTime, endTime, bayId }) {
			if (!requireAdmin(user)) return { ok: false, status: 403, error: 'Forbidden' };

			try {
				const value = await adminSlotsService.blockSlots({ startTime, endTime, bayId });
				return { ok: true, value };
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : 'Internal Server Error';
				if (message === 'Invalid date format') {
					return {
						ok: false,
						status: 400,
						error: 'Invalid date format',
						code: 'VALIDATION_ERROR',
					};
				}
				return { ok: false, status: 500, error: message };
			}
		},

		async unblockSlots({ user, startTime, endTime, bayId }) {
			if (!requireAdmin(user)) return { ok: false, status: 403, error: 'Forbidden' };

			try {
				const value = await adminSlotsService.unblockSlots({
					startTime,
					endTime,
					bayId,
				});
				return { ok: true, value };
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : 'Internal Server Error';
				if (message === 'Invalid date format') {
					return {
						ok: false,
						status: 400,
						error: 'Invalid date format',
						code: 'VALIDATION_ERROR',
					};
				}
				return { ok: false, status: 500, error: message };
			}
		},
	};
}

