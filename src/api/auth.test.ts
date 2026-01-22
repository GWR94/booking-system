import { describe, it, expect, vi, beforeEach } from 'vitest';
import { axios } from '@utils';
import {
	verifyUser,
	loginUser,
	logoutUser,
	registerUser,
	unlinkProvider,
	updateProfile,
	deleteAccount,
	checkEmailExists,
} from './auth';

vi.mock('@utils', () => ({
	axios: {
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn(),
		delete: vi.fn(),
	},
}));

describe('auth api', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('verifyUser should call GET /api/user/verify', async () => {
		const mockUser = { id: 1, name: 'Test' };
		(axios.get as any).mockResolvedValue({ data: { user: mockUser } });

		const result = await verifyUser();

		expect(axios.get).toHaveBeenCalledWith('/api/user/verify');
		expect(result).toEqual(mockUser);
	});

	it('loginUser should call POST /api/user/login', async () => {
		const credentials = { email: 'test@test.com', password: 'password' };
		const mockUser = { id: 1, name: 'Test' };
		(axios.post as any).mockResolvedValue({ data: { user: mockUser } });

		const result = await loginUser(credentials);

		expect(axios.post).toHaveBeenCalledWith('/api/user/login', credentials);
		expect(result).toEqual(mockUser);
	});

	it('logoutUser should call POST /api/user/logout', async () => {
		(axios.post as any).mockResolvedValue({});

		await logoutUser();

		expect(axios.post).toHaveBeenCalledWith('/api/user/logout');
	});

	it('registerUser should call POST /api/user/register', async () => {
		const credentials = {
			name: 'Test',
			email: 'test@test.com',
			password: 'password',
			allowMarketing: true,
		};
		(axios.post as any).mockResolvedValue({});

		await registerUser(credentials);

		expect(axios.post).toHaveBeenCalledWith('/api/user/register', credentials);
	});

	it('unlinkProvider should call DELETE /api/user/social-connection/:provider', async () => {
		const provider = 'google';
		const mockResponse = { success: true };
		(axios.delete as any).mockResolvedValue({ data: mockResponse });

		const result = await unlinkProvider(provider);

		expect(axios.delete).toHaveBeenCalledWith(
			`/api/user/social-connection/${provider}`,
		);
		expect(result).toEqual(mockResponse);
	});

	it('updateProfile should call PUT /api/user/profile', async () => {
		const userUpdate = { name: 'New Name' };
		const mockResponse = { success: true };
		(axios.put as any).mockResolvedValue({ data: mockResponse });

		const result = await updateProfile(userUpdate);

		expect(axios.put).toHaveBeenCalledWith('/api/user/profile', userUpdate);
		expect(result).toEqual(mockResponse);
	});

	it('deleteAccount should call DELETE /api/user/profile/delete', async () => {
		const mockResponse = { success: true };
		(axios.delete as any).mockResolvedValue({ data: mockResponse });

		const result = await deleteAccount();

		expect(axios.delete).toHaveBeenCalledWith('/api/user/profile/delete');
		expect(result).toEqual(mockResponse);
	});

	it('checkEmailExists should call GET /api/user/check-email', async () => {
		const email = 'test@test.com';
		const mockResponse = { exists: true };
		(axios.get as any).mockResolvedValue({ data: mockResponse });

		const result = await checkEmailExists(email);

		expect(axios.get).toHaveBeenCalledWith(
			`/api/user/check-email?email=${email}`,
		);
		expect(result).toEqual(mockResponse);
	});
});
