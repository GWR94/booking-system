import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockIsAdmin, mockGetSessionUser } = vi.hoisted(() => ({
	mockIsAdmin: vi.fn(),
	mockGetSessionUser: vi.fn(),
}));

const { mockDb } = vi.hoisted(() => ({
	mockDb: {
		slot: {
			findMany: vi.fn(),
			update: vi.fn(),
		},
		booking: {
			create: vi.fn(),
		},
	},
}));

vi.mock('@db', () => ({
	db: mockDb,
}));

vi.mock('@auth', () => ({
	getSessionUser: mockGetSessionUser,
	isAdmin: mockIsAdmin,
}));

vi.mock('next/headers', () => ({
	cookies: vi.fn().mockResolvedValue({
		get: vi.fn().mockReturnValue({ value: 'mock-token' }),
	}),
}));

import { POST } from './route';
import { createMockRequest } from '@test/api-test-utils';

describe('POST /api/admin/bookings/local-book', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should create admin booking successfully', async () => {
		mockIsAdmin.mockResolvedValue(true);
		mockGetSessionUser.mockResolvedValue({ id: 1, role: 'admin' });

		mockDb.slot.findMany.mockResolvedValue([{ id: 10, status: 'available' }]);
		mockDb.booking.create.mockResolvedValue({
			id: 100,
			status: 'confirmed - local',
		});
		mockDb.slot.update.mockResolvedValue({ id: 10, status: 'booked' });

		const req = createMockRequest({
			method: 'POST',
			body: { slotIds: [10] },
		});

		const response = await POST(req);

		expect(response.status).toBe(201);
		const data = await response.json();
		expect(data.message).toBe('Admin booking created successfully');
		expect(mockDb.booking.create).toHaveBeenCalled();
	});

	it('should return 400 if some slots are unavailable', async () => {
		mockIsAdmin.mockResolvedValue(true);
		mockGetSessionUser.mockResolvedValue({ id: 1, role: 'admin' });

		mockDb.slot.findMany.mockResolvedValue([]); // No slots found as available

		const req = createMockRequest({
			method: 'POST',
			body: { slotIds: [10] },
		});

		const response = await POST(req);

		expect(response.status).toBe(400);
		const data = await response.json();
		expect(data.error).toBe('SLOT_NOT_AVAILABLE');
	});
});
