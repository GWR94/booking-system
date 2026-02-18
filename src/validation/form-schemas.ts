import { z } from 'zod';

/**
 * Client-side validation schemas for forms
 * Detailed error messages for better UX
 */

const passwordRegex = /(?=.*[A-Z])(?=.*[!@#$&*])/;
const nameLettersOnly = /^[A-Za-z\s]+$/;
const fullNamePattern = /^\s*\S+\s+\S+.*$/;
const phonePattern = /^[0-9]{10,15}$/;

export const registrationSchema = z
	.object({
		email: z.email({ error: 'Please enter a valid email address' }),
		name: z
			.string()
			.min(1, 'Name is required')
			.min(5, 'Name must be at least 5 characters')
			.max(50, 'Name must not be more than 50 characters')
			.regex(nameLettersOnly, { error: 'Name can only contain letters and spaces.' }),
		password: z
			.string()
			.min(1, 'Password is required')
			.min(8, 'Password must be at least 8 characters long')
			.regex(passwordRegex, {
				error: 'Password must contain an uppercase letter and a special character',
			}),
		confirm: z.string().min(1, 'Confirm password is required'),
	})
	.refine((data) => data.password === data.confirm, {
		message: 'Passwords must match',
		path: ['confirm'],
	});

export const loginSchema = z.object({
	email: z.email({ error: 'Please enter a valid email address' }),
	password: z
		.string()
		.min(1, 'Password is required')
		.min(8, 'Password must be at least 8 characters long')
		.regex(passwordRegex, {
			error: 'Password must contain an uppercase letter and a special character',
		}),
});

export const guestSchema = z.object({
	name: z
		.string()
		.min(1, 'Name is required')
		.regex(fullNamePattern, { error: 'Please enter your full name (first and last name)' }),
	email: z.email({ error: 'Please enter a valid email address' }),
	phone: z
		.union([
			z.string().regex(phonePattern, { error: 'Phone number is not valid' }),
			z.literal(''),
		])
		.optional(),
});

export type RegistrationFormInput = z.infer<typeof registrationSchema>;
export type LoginFormInput = z.infer<typeof loginSchema>;
export type GuestFormInput = z.infer<typeof guestSchema>;
