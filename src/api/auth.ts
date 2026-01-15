import { LoginCredentials, RegisterCredentials, User } from '@components/auth';
import { axios } from '@utils';

export const verifyUser = async (): Promise<User> => {
	const { data } = await axios.get('/api/user/verify');
	return data.user;
};

export const loginUser = async (
	credentials: LoginCredentials,
): Promise<User> => {
	const { data } = await axios.post('/api/user/login', credentials);
	return data.user;
};

export const logoutUser = async () => {
	await axios.post('/api/user/logout');
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
	const response = await axios.put('/api/user/profile', user);
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
