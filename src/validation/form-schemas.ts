import Joi from 'joi';
import { RegistrationForm, LoginForm } from '../features/auth/components/types';

/**
 * Client-side validation schemas for forms
 * These have detailed error messages for better UX
 */

export const registrationSchema = Joi.object<RegistrationForm>({
	email: Joi.string()
		.email({
			tlds: { allow: false },
		})
		.required()
		.messages({
			'string.email': 'Please enter a valid email address',
			'string.empty': 'Email is required',
		}),
	name: Joi.string()
		.pattern(/^[A-Za-z\s]+$/)
		.min(5)
		.max(50)
		.required()
		.messages({
			'string.empty': 'Name is required',
			'string.pattern.base': 'Name can only contain letters and spaces.',
			'string.min': 'Name must be at least 5 characters',
			'string.max': 'Name must not be more than 50 characters',
		}),
	password: Joi.string()
		.min(8)
		.pattern(new RegExp('(?=.*[A-Z])(?=.*[!@#$&*])'))
		.required()
		.messages({
			'string.min': 'Password must be at least 8 characters long',
			'string.pattern.base':
				'Password must contain an uppercase letter and a special character',
			'string.empty': 'Password is required',
		}),
	confirm: Joi.string().min(1).required().valid(Joi.ref('password')).messages({
		'any.only': 'Passwords must match',
		'string.empty': 'Confirm password is required',
		'string.min': 'Confirm password is required',
	}),
});

export const loginSchema = Joi.object<LoginForm>({
	email: Joi.string()
		.email({
			tlds: { allow: false },
		})
		.required()
		.messages({
			'string.email': 'Please enter a valid email address',
			'string.empty': 'Email is required',
		}),
	password: Joi.string()
		.min(8)
		.pattern(new RegExp('(?=.*[A-Z])(?=.*[!@#$&*])'))
		.required()
		.messages({
			'string.min': 'Password must be at least 8 characters long',
			'string.pattern.base':
				'Password must contain an uppercase letter and a special character',
			'string.empty': 'Password is required',
		}),
});

export const guestSchema = Joi.object({
	name: Joi.string()
		.pattern(/^\s*\S+\s+\S+.*$/)
		.required()
		.messages({
			'string.empty': 'Name is required',
			'string.pattern.base':
				'Please enter your full name (first and last name)',
		}),
	email: Joi.string()
		.email({
			tlds: { allow: false },
		})
		.required()
		.messages({
			'string.email': 'Please enter a valid email address',
			'string.empty': 'Email is required',
		}),
	phone: Joi.string()
		.pattern(/^[0-9]{10,15}$/) // Basic phone number regex (adjust as needed)
		.allow('') // Allow empty string for optional
		.messages({
			'string.pattern.base': 'Phone number is not valid',
		})
		.optional(), // Mark as optional
});
