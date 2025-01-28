// AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import {
	AuthContextType,
	AuthProviderProps,
	LoginCredentials,
	RegisterCredentials,
	User,
} from '../components/interfaces/AuthContext.i';
import { useSnackbar } from './SnackbarContext';
import { AxiosError } from 'axios';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [isLoading, setLoading] = useState<boolean>(true);
	const [user, setUser] = useState<User | null>(null);
	const { showSnackbar, hideSnackbar } = useSnackbar();
	let authChecked = false;

	useEffect(() => {
		checkAuth();
	}, []);

	const checkAuth = async (): Promise<void> => {
		if (authChecked) return;
		authChecked = true;
		try {
			const response = await axios.get<{ user: User }>('/api/user/verify');
			setUser(response.data.user);
			setIsAuthenticated(true);
		} catch (error) {
			console.error(error);
			setUser(null);
			setIsAuthenticated(false);
		} finally {
			setLoading(false);
		}
	};

	const login = async (credentials: LoginCredentials): Promise<boolean> => {
		try {
			const response = await axios.post<{ user: User }>(
				`/api/user/login`,
				credentials,
			);

			if (response.status !== 200) return false;
			showSnackbar('Successfully signed in', 'success');
			setTimeout(() => {
				setUser(response.data.user);
				setIsAuthenticated(true);
				hideSnackbar();
			}, 1500);
			return true;
		} catch (error) {
			console.error('error', error);
			showSnackbar(
				(error as AxiosError<{ message: string }>).response?.data.message ??
					'Unable to sign in.\nPlease try again.',
				'error',
			);
			setUser(null);
			setIsAuthenticated(false);
			return false;
		}
	};

	const logout = async (): Promise<void> => {
		try {
			await axios.post(`/api/user/logout`);
			showSnackbar('Successfully logged out', 'success');
		} catch (error) {
			console.error('Logout error:', error);
		} finally {
			setUser(null);
			setIsAuthenticated(false);
		}
	};

	const register = async ({
		name,
		email,
		password,
	}: RegisterCredentials): Promise<boolean> => {
		try {
			setLoading(true);
			await axios.post(`/api/user/register`, {
				name,
				email,
				password,
			});
			showSnackbar('User successfully registered', 'success');
			setLoading(false);
			return true;
		} catch (err) {
			const message =
				(err as AxiosError<{ message: string }>).response?.data.message ??
				'Unable to complete registration';
			console.log(err);
			setLoading(false);
			showSnackbar(message, 'error');
			return false;
		}
	};

	const value: AuthContextType = {
		isAuthenticated,
		isLoading,
		user,
		login,
		logout,
		checkAuth,
		register,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
