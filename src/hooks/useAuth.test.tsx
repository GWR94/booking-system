import { renderHook, waitFor, act } from '@testing-library/react';
import { useAuth } from './useAuth';
import createWrapper from '@utils/test-utils';
import { verifyUser, loginUser, logoutUser, registerUser } from '@api';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock API
vi.mock('@api', () => ({
	verifyUser: vi.fn(),
	loginUser: vi.fn(),
	logoutUser: vi.fn(),
	registerUser: vi.fn(),
}));

describe('useAuth', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should initialize with no user', async () => {
		(verifyUser as any).mockResolvedValue(null);

		const { result } = renderHook(() => useAuth(), {
			wrapper: createWrapper(),
		});

		await waitFor(() => expect(result.current.isLoading).toBe(false));
		expect(result.current.user).toBeNull();
		expect(result.current.isAuthenticated).toBe(false);
	});

	it('should initialize with authenticated user', async () => {
		const mockUser = { id: 1, name: 'Test User', role: 'user' };
		(verifyUser as any).mockResolvedValue(mockUser);

		const { result } = renderHook(() => useAuth(), {
			wrapper: createWrapper(),
		});

		await waitFor(() => {
			expect(verifyUser).toHaveBeenCalled();
			if (result.current.isLoading) throw new Error('Still loading');
			expect(result.current.user).toEqual(mockUser);
		});
		expect(result.current.isAuthenticated).toBe(true);
		expect(result.current.isAdmin).toBe(false);
	});

	it('should login successfully', async () => {
		const mockUser = { id: 1, name: 'Test User', role: 'user' };
		(verifyUser as any).mockResolvedValue(null);
		(loginUser as any).mockResolvedValue(mockUser);

		const { result } = renderHook(() => useAuth(), {
			wrapper: createWrapper(),
		});
		await waitFor(() => expect(result.current.isLoading).toBe(false));

		await act(async () => {
			await result.current.login({
				email: 'test@test.com',
				password: 'password',
			} as any);
		});

		expect(loginUser).toHaveBeenCalledWith({
			email: 'test@test.com',
			password: 'password',
		});
		// Note: react-query cache update not easily visible in hook return immediately without re-render cycle or queryClient check
		// But we can check function call success
	});

	it('should logout successfully', async () => {
		(verifyUser as any).mockResolvedValue({ id: 1 });
		(logoutUser as any).mockResolvedValue({});

		const { result } = renderHook(() => useAuth(), {
			wrapper: createWrapper(),
		});
		await waitFor(() => expect(result.current.isLoading).toBe(false));

		await act(async () => {
			await result.current.logout();
		});

		expect(logoutUser).toHaveBeenCalled();
	});

	it('should identify admin user correctly', async () => {
		const adminUser = { id: 1, name: 'Admin User', role: 'admin' };
		(verifyUser as any).mockResolvedValue(adminUser);

		const { result } = renderHook(() => useAuth(), {
			wrapper: createWrapper(),
		});

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
			expect(result.current.user).toEqual(adminUser);
		});
		expect(result.current.isAdmin).toBe(true);
		expect(result.current.isAuthenticated).toBe(true);
	});

	it('should handle login error', async () => {
		(verifyUser as any).mockResolvedValue(null);
		const errorResponse = {
			response: { data: { message: 'Invalid credentials' } },
		};
		(loginUser as any).mockRejectedValue(errorResponse);

		const { result } = renderHook(() => useAuth(), {
			wrapper: createWrapper(),
		});
		await waitFor(() => expect(result.current.isLoading).toBe(false));

		// Act & Assert
		await act(async () => {
			try {
				await result.current.login({
					email: 'wrong@test.com',
					password: 'wrongpass',
				} as any);
			} catch (error) {
				// Expected to throw
			}
		});

		expect(loginUser).toHaveBeenCalledWith({
			email: 'wrong@test.com',
			password: 'wrongpass',
		});
	});

	it('should register user successfully', async () => {
		(verifyUser as any).mockResolvedValue(null);
		(registerUser as any).mockResolvedValue({ id: 1, name: 'New User' });

		const { result } = renderHook(() => useAuth(), {
			wrapper: createWrapper(),
		});
		await waitFor(() => expect(result.current.isLoading).toBe(false));

		await act(async () => {
			await result.current.register({
				email: 'new@test.com',
				password: 'password',
				name: 'New User',
			} as any);
		});

		expect(registerUser).toHaveBeenCalledWith({
			email: 'new@test.com',
			password: 'password',
			name: 'New User',
		});
	});

	it('should handle register error', async () => {
		(verifyUser as any).mockResolvedValue(null);
		const errorResponse = {
			response: { data: { message: 'Email already exists' } },
		};
		(registerUser as any).mockRejectedValue(errorResponse);

		const { result } = renderHook(() => useAuth(), {
			wrapper: createWrapper(),
		});
		await waitFor(() => expect(result.current.isLoading).toBe(false));

		// Act & Assert
		await act(async () => {
			try {
				await result.current.register({
					email: 'existing@test.com',
					password: 'password',
				} as any);
			} catch (error) {
				// Expected to throw
			}
		});

		expect(registerUser).toHaveBeenCalledWith({
			email: 'existing@test.com',
			password: 'password',
		});
	});
});
