import axios from '../utils/axiosConfig';
import {
	LoginCredentials,
	RegisterCredentials,
	User,
} from '../components/interfaces/AuthContext.i';

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
