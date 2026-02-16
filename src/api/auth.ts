import type { RegisterCredentials, User } from '@features/auth/components';
import { axios } from '@api/client';

export const verifyUser = async (): Promise<User> => {
	const { data } = await axios.get('/api/user/me');
	return data.user;
};

export const registerUser = async (credentials: RegisterCredentials) => {
	await axios.post('/api/user/register', credentials);
};

export const unlinkProvider = async (provider: string) => {
	const response = await axios.delete(
		`/api/user/social-connection/${provider}`,
	);
	return response.data;
};

export const updateProfile = async (user: Partial<User>) => {
	const response = await axios.patch('/api/user/me', user);
	return response.data;
};

export const deleteAccount = async () => {
	const response = await axios.delete('/api/user/profile/delete');
	return response.data;
};

export const checkEmailExists = async (email: string) => {
	const response = await axios.get(`/api/user/check-email?email=${email}`);
	return response.data;
};

export const requestPasswordReset = async (email: string) => {
	const response = await axios.post('/api/user/request-password-reset', {
		email,
	});
	return response.data;
};

export const resetPassword = async (credentials: {
	token: string;
	password: string;
}) => {
	const response = await axios.post('/api/user/reset-password', credentials);
	return response.data;
};
