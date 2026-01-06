import { renderHook, waitFor, act } from '@testing-library/react';
import { useAuth } from './useAuth';
import { createWrapper } from '../utils/test-utils';
import { verifyUser, loginUser, logoutUser, registerUser } from '../api/auth';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock API
vi.mock('../api/auth', () => ({
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
		// Arrange
		(verifyUser as any).mockResolvedValue(null);

		// Act
		const { result } = renderHook(() => useAuth(), {
			wrapper: createWrapper(),
		});

		// Assert
		await waitFor(() => expect(result.current.isLoading).toBe(false));
		expect(result.current.user).toBeNull();
		expect(result.current.isAuthenticated).toBe(false);
	});

	it('should initialize with authenticated user', async () => {
		// Arrange
		const mockUser = { id: 1, name: 'Test User', role: 'user' };
		(verifyUser as any).mockResolvedValue(mockUser);

		// Act
		const { result } = renderHook(() => useAuth(), {
			wrapper: createWrapper(),
		});

		// Assert
		await waitFor(() => expect(result.current.isLoading).toBe(false));
		expect(result.current.user).toEqual(mockUser);
		expect(result.current.isAuthenticated).toBe(true);
		expect(result.current.isAdmin).toBe(false);
	});

	it('should login successfully', async () => {
		// Arrange
		const mockUser = { id: 1, name: 'Test User', role: 'user' };
		(verifyUser as any).mockResolvedValue(null);
		(loginUser as any).mockResolvedValue(mockUser);

		const { result } = renderHook(() => useAuth(), {
			wrapper: createWrapper(),
		});
		await waitFor(() => expect(result.current.isLoading).toBe(false));

		// Act
		await act(async () => {
			await result.current.login({
				email: 'test@test.com',
				password: 'password',
			} as any);
		});

		// Assert
		expect(loginUser).toHaveBeenCalledWith({
			email: 'test@test.com',
			password: 'password',
		});
		// Note: react-query cache update not easily visible in hook return immediately without re-render cycle or queryClient check
		// But we can check function call success
	});

	it('should logout successfully', async () => {
		// Arrange
		(verifyUser as any).mockResolvedValue({ id: 1 });
		(logoutUser as any).mockResolvedValue({});

		const { result } = renderHook(() => useAuth(), {
			wrapper: createWrapper(),
		});
		await waitFor(() => expect(result.current.isLoading).toBe(false));

		// Act
		await act(async () => {
			await result.current.logout();
		});

		// Assert
		expect(logoutUser).toHaveBeenCalled();
	});
});
