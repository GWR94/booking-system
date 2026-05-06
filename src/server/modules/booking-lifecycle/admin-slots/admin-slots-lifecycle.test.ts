import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeAdminSlotsLifecycle } from './admin-slots-lifecycle';

describe('admin-slots-lifecycle', () => {
	const adminUser = { role: 'admin' };
	const notAdminUser = { role: 'user' };

	const adminSlotsService = {
		getAdminSlots: vi.fn(),
		createSlot: vi.fn(),
		updateSlot: vi.fn(),
		deleteSlot: vi.fn(),
		blockSlots: vi.fn(),
		unblockSlots: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('enforces admin-only', async () => {
		const lifecycle = makeAdminSlotsLifecycle({ adminSlotsService } as any);
		const res = await lifecycle.getSlots({ user: notAdminUser, date: '2025-01-01' });
		expect(res.ok).toBe(false);
		if (!res.ok) {
			expect(res.status).toBe(403);
			expect(res.error).toBe('Forbidden');
		}
	});

	it('maps getAdminSlots "Date is required" to 400 VALIDATION_ERROR', async () => {
		adminSlotsService.getAdminSlots.mockRejectedValue(new Error('Date is required'));
		const lifecycle = makeAdminSlotsLifecycle({ adminSlotsService } as any);

		const res = await lifecycle.getSlots({ user: adminUser, date: '' });
		expect(res.ok).toBe(false);
		if (!res.ok) {
			expect(res.status).toBe(400);
			expect(res.code).toBe('VALIDATION_ERROR');
			expect(res.error).toBe('Date is required');
		}
	});

	it('maps blockSlots "Invalid date format" to 400 VALIDATION_ERROR', async () => {
		adminSlotsService.blockSlots.mockRejectedValue(new Error('Invalid date format'));
		const lifecycle = makeAdminSlotsLifecycle({ adminSlotsService } as any);

		const res = await lifecycle.blockSlots({
			user: adminUser,
			startTime: { toDate: () => new Date() } as any,
			endTime: { toDate: () => new Date() } as any,
		});
		expect(res.ok).toBe(false);
		if (!res.ok) {
			expect(res.status).toBe(400);
			expect(res.code).toBe('VALIDATION_ERROR');
			expect(res.error).toBe('Invalid date format');
		}
	});

	it('maps updateSlot invalid messages to 400 VALIDATION_ERROR', async () => {
		adminSlotsService.updateSlot.mockRejectedValue(
			new Error('Invalid startTime format'),
		);
		const lifecycle = makeAdminSlotsLifecycle({ adminSlotsService } as any);

		const res = await lifecycle.updateSlot({
			user: adminUser,
			slotId: 1,
			startTime: { toDate: () => new Date() } as any,
			endTime: { toDate: () => new Date() } as any,
			status: 'available',
			bay: 1,
		});
		expect(res.ok).toBe(false);
		if (!res.ok) {
			expect(res.status).toBe(400);
			expect(res.code).toBe('VALIDATION_ERROR');
		}
	});
});

