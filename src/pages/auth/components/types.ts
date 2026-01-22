export interface User {
	id: number;
	name: string;
	email: string | null;
	phone?: string;
	role: string;
	googleId?: string;
	facebookId?: string;
	twitterId?: string;
	allowMarketing?: boolean;
	stripeCustomerId?: string;
	membershipTier?: 'PAR' | 'BIRDIE' | 'HOLEINONE';
	membershipStatus?: 'ACTIVE' | 'CANCELLED';
	currentPeriodStart?: string;
	currentPeriodEnd?: string;
	cancelAtPeriodEnd?: boolean;
	passwordHash?: string | boolean;
	bookings?: any[];
}

export interface LoginCredentials {
	email: string;
	password?: string;
}

export interface RegisterCredentials {
	name: string;
	email: string;
	phone?: string;
	password?: string;
	allowMarketing?: boolean;
}

export interface FormField {
	value: string;
	errorMsg: string;
}

export interface FormInput {
	name: FormField;
	email: FormField;
	password: FormField;
	confirm: FormField;
}

export type FormInputType = keyof FormInput;

export interface LoginForm {
	email: string;
	password?: string;
}

export interface RegistrationForm {
	name: string;
	email: string;
	password: string;
	confirm: string;
}
