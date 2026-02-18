import { describe, it, expect } from 'vitest';
import {
	registrationSchema,
	loginSchema,
	guestSchema,
} from './form-schemas';

describe('form-schemas', () => {
	describe('registrationSchema', () => {
		it('should accept valid registration when password and confirm match', () => {
			const result = registrationSchema.safeParse({
				name: 'Jane Doe',
				email: 'jane@example.com',
				password: 'Password1!',
				confirm: 'Password1!',
			});
			expect(result.success).toBe(true);
		});

		it('should reject when password and confirm do not match', () => {
			const result = registrationSchema.safeParse({
				name: 'Jane Doe',
				email: 'jane@example.com',
				password: 'Password1!',
				confirm: 'OtherPass1!',
			});
			expect(result.success).toBe(false);
		});

		it('should reject short or weak password', () => {
			expect(
				registrationSchema.safeParse({
					name: 'Jane Doe',
					email: 'j@j.com',
					password: 'short',
					confirm: 'short',
				}).success,
			).toBe(false);
		});
	});

	describe('loginSchema', () => {
		it('should accept valid email and password', () => {
			const result = loginSchema.safeParse({
				email: 'user@example.com',
				password: 'Password1!',
			});
			expect(result.success).toBe(true);
		});

		it('should reject invalid email', () => {
			expect(loginSchema.safeParse({ email: 'x', password: 'Password1!' }).success).toBe(false);
		});
	});

	describe('guestSchema', () => {
		it('should accept full name, email and optional phone', () => {
			const result = guestSchema.safeParse({
				name: 'John Smith',
				email: 'john@example.com',
			});
			expect(result.success).toBe(true);
			const withPhone = guestSchema.safeParse({
				name: 'John Smith',
				email: 'j@j.com',
				phone: '07700900123',
			});
			expect(withPhone.success).toBe(true);
		});

		it('should reject single name (requires full name pattern)', () => {
			const result = guestSchema.safeParse({
				name: 'John',
				email: 'john@example.com',
			});
			expect(result.success).toBe(false);
		});
	});
});
