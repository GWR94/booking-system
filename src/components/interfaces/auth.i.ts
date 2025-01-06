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
