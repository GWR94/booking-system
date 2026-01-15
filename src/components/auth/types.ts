import { Booking } from '@components/booking';

export interface RegistrationForm {
	email: string;
	name: string;
	password: string;
	confirm: string;
}

export interface LoginForm {
	email: string;
	password: string;
}

export type FormInputType = 'name' | 'email' | 'password' | 'confirm';

export interface FormInput {
	name: {
		value: string;
		errorMsg: string;
	};
	email: {
		value: string;
		errorMsg: string;
	};
	password: {
		value: string;
		errorMsg: string;
	};
	confirm: {
		value: string;
		errorMsg: string;
	};
}

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
	twitterId: string | null;
	membershipTier?: 'PAR' | 'BIRDIE' | 'HOLEINONE' | null;
	membershipStatus?: 'ACTIVE' | 'CANCELLED' | null;
	currentPeriodStart?: string;
	currentPeriodEnd?: string;
}
