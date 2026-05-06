import type { Slot } from '@prisma/client';

export type Logger = Pick<Console, 'error' | 'warn' | 'info' | 'log'>;

export type Actor =
	| { type: 'user'; userId: number; role?: string }
	| { type: 'admin'; adminId: number; role?: string }
	| { type: 'system' };

export type CancelResult = {
	refundStatus: 'refunded' | 'not_refunded_policy' | 'not_applicable' | 'failed';
	refundWarning?: string;
};

export type CleanupResult = {
	cleaned: number;
};

export type BookingLifecycleDeps = {
	db?: {
		booking: {
			findUnique: (args: any) => Promise<any>;
			findFirst: (args: any) => Promise<any>;
			findMany: (args: any) => Promise<any>;
			update: (args: any) => Promise<any>;
		};
		slot: {
			updateMany: (args: any) => Promise<any>;
		};
	};
	bookingService?: {
		confirmBooking: (
			bookingId: number,
			paymentId: string,
			paymentStatus: string,
		) => Promise<unknown>;
		createBooking: (args: any) => Promise<{ id: number }>;
		handleFailedPayment: (bookingId: number) => Promise<unknown>;
	};
	stripe?: {
		refunds?: { create: (args: any, opts?: any) => Promise<any> };
		paymentIntents?: { update: (paymentIntentId: string, args: any) => Promise<any> };
	};
	sendRefundFailedAlert?: (args: {
		bookingId: number;
		paymentId: string;
		userEmail: string;
	}) => Promise<unknown>;
	clock?: { now: () => Date };
	logger?: Logger;
};

export type BookingLifecycle = {
	createPendingBooking: (args: {
		slotIds: number[];
		paymentId?: string;
		paymentStatus?: string;
		userId?: number;
		guestInfo?: { name: string; email: string; phone?: string };
	}) => Promise<
		| { ok: true; booking: unknown }
		| { ok: false; status: 500; error: string }
	>;
	cancelBooking: (args: {
		bookingId: number;
		actor: { userId: number; role: string };
	}) => Promise<
		| { ok: true; result: CancelResult }
		| { ok: false; status: 403 | 404; error: string }
	>;
	cleanupStalePendingBookings: (args: {
		olderThanMinutes: number;
	}) => Promise<
		| { ok: true; result: CleanupResult }
		| { ok: false; status: 500; error: string }
	>;
	confirmPaid: (args: {
		bookingId: number;
		paymentId: string;
		paymentStatus: string;
	}) => Promise<void>;
	markPaymentFailed: (args: { bookingId: number }) => Promise<void>;
	handlePaymentIntentCreated: (args: {
		paymentIntentId: string;
		paymentStatus: string;
		metadata: Record<string, unknown>;
	}) => Promise<void>;
	handlePaymentIntentSucceeded: (args: {
		paymentIntentId: string;
		paymentStatus: string;
		metadata: Record<string, unknown>;
	}) => Promise<void>;
	handlePaymentIntentFailed: (args: {
		paymentIntentId: string;
		paymentStatus: string;
		metadata: Record<string, unknown>;
	}) => Promise<void>;
};

