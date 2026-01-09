import { Booking } from './Booking.i';

export interface AuthContextType {
	isAuthenticated: boolean;
	isLoading: boolean;
	user: User | null;
	register: (credentials: RegisterCredentials) => Promise<boolean>;
	login: (credentials: LoginCredentials) => Promise<boolean>;
	logout: () => Promise<void>;
	checkAuth: () => Promise<void>;
	isAdmin: boolean;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface RegisterCredentials extends LoginCredentials {
	name: string;
}

export interface AuthProviderProps {
	children: React.ReactNode;
}

export interface AlertState {
	error: boolean;
	isOpen: boolean;
	message: string;
}

export interface User {
	id: number;
	name: string;
	email: string | null;
	passwordHash: string | null;
	role: 'user' | 'admin';
	bookings: Booking[];
	googleId: string | null;
	facebookId: string | null;
	appleId: string | null;
	membershipTier?: string;
	membershipStatus?: string;
}
