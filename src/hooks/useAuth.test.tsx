import { renderHook, waitFor, act } from '@testing-library/react';
import { useAuth } from './useAuth';
import createWrapper from '@utils/test-utils';
import { registerUser } from '@api';
import { signIn, signOut, useSession } from 'next-auth/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock API
vi.mock('@api', () => ({
	registerUser: vi.fn(),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
	useRouter: () => ({
		push: vi.fn(),
		refresh: vi.fn(),
	}),
}));

describe('useAuth', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Reset to default unauthenticated state
		vi.mocked(useSession).mockReturnValue({
			data: null,
			status: 'unauthenticated',
			update: vi.fn(),
		});
	});

	it('should initialize with no user', () => {
		const { result } = renderHook(() => useAuth(), {
			wrapper: createWrapper(),
		});

		expect(result.current.user).toBeNull();
		expect(result.current.isAuthenticated).toBe(false);
		expect(result.current.isLoading).toBe(false);
	});

	it('should initialize with authenticated user', () => {
		const mockUser = { id: '1', name: 'Test User', email: 'test@test.com', role: 'user' };
		
		// Mock useSession to return authenticated user
		vi.mocked(useSession).mockReturnValue({
			data: { user: mockUser },
			status: 'authenticated',
			update: vi.fn(),
		});

		const { result } = renderHook(() => useAuth(), {
			wrapper: createWrapper(),
		});

		expect(result.current.user).toEqual(mockUser);
		expect(result.current.isAuthenticated).toBe(true);
		expect(result.current.isAdmin).toBe(false);
	});

	it('should login successfully', async () => {
		vi.mocked(signIn).mockResolvedValue({ ok: true, error: null } as any);

		const { result } = renderHook(() => useAuth(), {
			wrapper: createWrapper(),
		});

		await act(async () => {
			await result.current.login({
				email: 'test@test.com',
				password: 'password',
			});
		});

		expect(signIn).toHaveBeenCalledWith('credentials', {
			email: 'test@test.com',
			password: 'password',
			redirect: false,
		});
	});

	it('should logout successfully', async () => {
		vi.mocked(signOut).mockResolvedValue(undefined as any);

		const { result } = renderHook(() => useAuth(), {
			wrapper: createWrapper(),
		});

		await act(async () => {
			await result.current.logout();
		});

		expect(signOut).toHaveBeenCalledWith({ redirect: false });
	});

	it('should identify admin user correctly', () => {
		const adminUser = { id: '1', name: 'Admin User', email: 'admin@test.com', role: 'admin' };
		
		// Mock useSession to return admin user
		vi.mocked(useSession).mockReturnValue({
			data: { user: adminUser },
			status: 'authenticated',
			update: vi.fn(),
		});

		const { result } = renderHook(() => useAuth(), {
			wrapper: createWrapper(),
		});

		expect(result.current.user).toEqual(adminUser);
		expect(result.current.isAdmin).toBe(true);
		expect(result.current.isAuthenticated).toBe(true);
	});

	it('should handle login error', async () => {
		vi.mocked(signIn).mockResolvedValue({ ok: false, error: 'Invalid credentials' } as any);

		const { result } = renderHook(() => useAuth(), {
			wrapper: createWrapper(),
		});

		await act(async () => {
			try {
				await result.current.login({
					email: 'wrong@test.com',
					password: 'wrongpass',
				});
			} catch (error) {
				// Expected to throw
			}
		});

		expect(signIn).toHaveBeenCalledWith('credentials', {
			email: 'wrong@test.com',
			password: 'wrongpass',
			redirect: false,
		});
	});

	it('should register user successfully', async () => {
		(registerUser as any).mockResolvedValue({ id: 1, name: 'New User' });

		const { result } = renderHook(() => useAuth(), {
			wrapper: createWrapper(),
		});

		await act(async () => {
			await result.current.register({
				email: 'new@test.com',
				password: 'password',
				name: 'New User',
			});
		});

		// registerUser is called with the data + mutation context, so we check the first argument
		expect(registerUser).toHaveBeenCalled();
		const callArgs = (registerUser as any).mock.calls[0][0];
		expect(callArgs).toEqual({
			email: 'new@test.com',
			password: 'password',
			name: 'New User',
		});
	});

	it('should handle register error', async () => {
		const errorResponse = {
			response: { data: { message: 'Email already exists' } },
		};
		(registerUser as any).mockRejectedValue(errorResponse);

		const { result } = renderHook(() => useAuth(), {
			wrapper: createWrapper(),
		});

		await act(async () => {
			try {
				await result.current.register({
					email: 'existing@test.com',
					password: 'password',
				});
			} catch (error) {
				// Expected to throw
			}
		});

		expect(registerUser).toHaveBeenCalled();
	});
});
