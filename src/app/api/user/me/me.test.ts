import { describe, it, expect, vi, beforeEach } from 'vitest';

// Hoist ALL mocks before any imports
const { mockAuth } = vi.hoisted(() => ({
	mockAuth: vi.fn(),
}));

const { mockDb } = vi.hoisted(() => ({
	mockDb: {
		user: {
			findUnique: vi.fn(),
			update: vi.fn(),
		},
	},
}));

const { mockMembershipService } = vi.hoisted(() => ({
	mockMembershipService: {
		getUsageStats: vi.fn(),
	},
}));

// Mock Next.js server with proper implementation
vi.mock('next/server', () => {
	class MockNextRequest extends Request {
		public nextUrl: URL;
		constructor(input: RequestInfo | URL, init?: RequestInit) {
			super(input, init);
			const url =
				typeof input === 'string'
					? input
					: input instanceof Request
						? input.url
						: input.toString();
			this.nextUrl = new URL(url);
		}
	}

	return {
		NextResponse: {
			json: (data: any, init?: ResponseInit) =>
				new Response(JSON.stringify(data), {
					...init,
					headers: { 'Content-Type': 'application/json', ...init?.headers },
				}),
		},
		NextRequest: MockNextRequest,
	};
});

// Mock auth so route does not load next-auth (which pulls in next/server and breaks in Vitest)
vi.mock('../../../../auth', () => ({
	auth: mockAuth,
}));

// Mock database
vi.mock('@db', () => ({
	db: mockDb,
}));

// Mock membership service
vi.mock('src/server/modules/membership/membership.service', () => ({
	MembershipService: mockMembershipService,
}));

// Now import the route handlers
import { GET, PATCH } from './route';
import { createMockRequest } from '@test/api-test-utils';

describe('User Me API', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('GET /api/user/me', () => {
		it('should return user with membership stats if logged in', async () => {
			const mockUser = {
				id: 1,
				name: 'Test User',
				email: 'test@test.com',
				role: 'user',
				bookings: [],
			};
			const mockStats = { used: 5, total: 10 };

			// Mock authenticated session
			mockAuth.mockResolvedValue({
				user: { id: '1', name: 'Test User', email: 'test@test.com' },
			});
			mockDb.user.findUnique.mockResolvedValue(mockUser);
			mockMembershipService.getUsageStats.mockResolvedValue(mockStats);

			const req = createMockRequest({ method: 'GET' });
			const response = await GET(req);

			expect(response.status).toBe(200);
			const data = await response.json();
			expect(data.user.id).toBe(1);
			expect(data.user.membershipUsage).toEqual(mockStats);
		});

		it('should return null user if not logged in', async () => {
			// Mock unauthenticated session
			mockAuth.mockResolvedValue(null);

			const req = createMockRequest({ method: 'GET' });
			const response = await GET(req);

			expect(response.status).toBe(200);
			const data = await response.json();
			expect(data.user).toBeNull();
		});
	});

	describe('PATCH /api/user/me', () => {
		it('should update profile and protect against mass assignment', async () => {
			const mockUser = { id: 1, name: 'Old Name', role: 'user' };
			const updatedUser = { id: 1, name: 'New Name', role: 'user' };

			// Mock authenticated session
			mockAuth.mockResolvedValue({
				user: { id: '1', name: 'Old Name', email: 'test@test.com' },
			});
			mockDb.user.findUnique.mockResolvedValue(mockUser);
			mockDb.user.update.mockResolvedValue(updatedUser);

			const req = createMockRequest({
				method: 'PATCH',
				body: {
					name: 'New Name',
					role: 'admin', // This should be filtered out
				},
			});

			const response = await PATCH(req);

			expect(response.status).toBe(200);
			expect(mockDb.user.update).toHaveBeenCalledWith({
				where: { id: 1 },
				data: { name: 'New Name' }, // 'role' should be missing
			});
			const data = await response.json();
			expect(data.message).toBe('Profile updated successfully');
		});

		it('should return 401 if not logged in', async () => {
			// Mock unauthenticated session
			mockAuth.mockResolvedValue(null);

			const req = createMockRequest({ method: 'PATCH', body: { name: 'New' } });
			const response = await PATCH(req);

			expect(response.status).toBe(401);
		});
	});
});
