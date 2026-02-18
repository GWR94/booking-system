import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockRequest, parseResponse } from '@test/api-test-utils';

const { mockDb } = vi.hoisted(() => ({
	mockDb: {
		slot: { findMany: vi.fn() },
	},
}));

const mockGetStripe = vi.fn();
const mockCalculateBasketCost = vi.fn();
const mockVerifyRecaptcha = vi.fn();

vi.mock('@db', () => ({
	db: mockDb,
}));

vi.mock('@lib/stripe', () => ({
	getStripe: (...args: unknown[]) => mockGetStripe(...args),
}));

vi.mock('@utils', () => ({
	calculateBasketCost: (...args: unknown[]) => mockCalculateBasketCost(...args),
}));

vi.mock('src/server/lib/recaptcha', () => ({
	verifyRecaptcha: (...args: unknown[]) => mockVerifyRecaptcha(...args),
}));

import { POST } from './route';

describe('POST /api/bookings/payment-intent', () => {
	const mockPaymentIntentsCreate = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		mockGetStripe.mockReturnValue({
			paymentIntents: {
				create: mockPaymentIntentsCreate,
			},
		});
		mockPaymentIntentsCreate.mockResolvedValue({
			client_secret: 'pi_secret_xyz',
		});
		mockCalculateBasketCost.mockReturnValue(5000);
	});

	it('should return 400 for invalid body', async () => {
		const req = createMockRequest({
			method: 'POST',
			body: { items: [] },
		});
		const response = await POST(req);
		const { body, status } = await parseResponse(response);
		expect(status).toBe(400);
		expect(body.code).toBe('VALIDATION_ERROR');
		expect(mockDb.slot.findMany).not.toHaveBeenCalled();
	});

	it('should return 400 when guest checkout has no recaptchaToken', async () => {
		const req = createMockRequest({
			method: 'POST',
			body: {
				items: [{ slotIds: [1] }],
				guestInfo: {
					name: 'Guest',
					email: 'guest@example.com',
					phone: '07700900123',
				},
			},
		});
		const response = await POST(req);
		const { body, status } = await parseResponse(response);
		expect(status).toBe(400);
		expect(body.error).toBe('reCAPTCHA token is required for guest checkout');
		expect(mockVerifyRecaptcha).not.toHaveBeenCalled();
	});

	it('should return 400 when guest checkout has empty recaptchaToken', async () => {
		const req = createMockRequest({
			method: 'POST',
			body: {
				items: [{ slotIds: [1] }],
				guestInfo: { name: 'G', email: 'g@e.com' },
				recaptchaToken: '   ',
			},
		});
		const response = await POST(req);
		const { body, status } = await parseResponse(response);
		expect(status).toBe(400);
		expect(body.error).toBe('reCAPTCHA token is required for guest checkout');
	});

	it('should return 400 when recaptcha verification fails for guest', async () => {
		mockVerifyRecaptcha.mockResolvedValue(false);
		mockDb.slot.findMany.mockResolvedValue([{ id: 1 }]);

		const req = createMockRequest({
			method: 'POST',
			body: {
				items: [{ slotIds: [1] }],
				guestInfo: { name: 'G', email: 'g@e.com' },
				recaptchaToken: 'valid-token',
			},
		});
		const response = await POST(req);
		const { body, status } = await parseResponse(response);
		expect(status).toBe(400);
		expect(body.error).toBe('reCAPTCHA verification failed');
		expect(mockVerifyRecaptcha).toHaveBeenCalledWith('valid-token');
		expect(mockDb.slot.findMany).not.toHaveBeenCalled();
	});

	it('should return 400 when one or more slots not found', async () => {
		mockDb.slot.findMany.mockResolvedValue([{ id: 1 }]);

		const req = createMockRequest({
			method: 'POST',
			body: { items: [{ slotIds: [1, 2] }] },
		});
		const response = await POST(req);
		const { body, status } = await parseResponse(response);
		expect(status).toBe(400);
		expect(body.code).toBe('SLOT_NOT_FOUND');
		expect(body.missingSlotIds).toEqual([2]);
		expect(mockPaymentIntentsCreate).not.toHaveBeenCalled();
	});

	it('should return clientSecret for authenticated user when slots exist', async () => {
		mockDb.slot.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }]);

		const req = createMockRequest({
			method: 'POST',
			body: { items: [{ slotIds: [1] }, { slotIds: [2] }] },
		});
		const response = await POST(req);
		const { body, status } = await parseResponse(response);
		expect(status).toBe(200);
		expect(body.clientSecret).toBe('pi_secret_xyz');
		expect(mockDb.slot.findMany).toHaveBeenCalledWith({
			where: { id: { in: [1, 2] } },
		});
		expect(mockCalculateBasketCost).toHaveBeenCalled();
		expect(mockPaymentIntentsCreate).toHaveBeenCalledWith({
			amount: 5000,
			currency: 'gbp',
			metadata: expect.objectContaining({
				slotIds: '[1,2]',
				isGuest: 'false',
			}),
		});
	});

	it('should verify recaptcha and return clientSecret for guest checkout', async () => {
		mockVerifyRecaptcha.mockResolvedValue(true);
		mockDb.slot.findMany.mockResolvedValue([{ id: 1 }]);

		const req = createMockRequest({
			method: 'POST',
			body: {
				items: [{ slotIds: [1] }],
				guestInfo: {
					name: 'Guest User',
					email: 'guest@example.com',
					phone: '07700900000',
				},
				recaptchaToken: 'token123',
			},
		});
		const response = await POST(req);
		const { body, status } = await parseResponse(response);
		expect(status).toBe(200);
		expect(body.clientSecret).toBe('pi_secret_xyz');
		expect(mockVerifyRecaptcha).toHaveBeenCalledWith('token123');
		expect(mockPaymentIntentsCreate).toHaveBeenCalledWith({
			amount: 5000,
			currency: 'gbp',
			metadata: expect.objectContaining({
				slotIds: '[1]',
				isGuest: 'true',
				guestName: 'Guest User',
				guestEmail: 'guest@example.com',
				guestPhone: '07700900000',
			}),
		});
	});

	it('should return 500 on Stripe error', async () => {
		mockDb.slot.findMany.mockResolvedValue([{ id: 1 }]);
		mockPaymentIntentsCreate.mockRejectedValue(new Error('Stripe error'));

		const req = createMockRequest({
			method: 'POST',
			body: { items: [{ slotIds: [1] }] },
		});
		const response = await POST(req);
		const { body, status } = await parseResponse(response);
		expect(status).toBe(500);
		expect(body.error).toBe('Internal Server Error');
	});
});
