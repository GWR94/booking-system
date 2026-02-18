import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { validateGuestInput } from './validate-guest-input';

const simpleGuestSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.email('Invalid email'),
	phone: z.string().optional(),
});

type SimpleGuest = z.infer<typeof simpleGuestSchema>;

describe('validateGuestInput', () => {
	it('should return isValid true and empty errors when data is valid', () => {
		const data: SimpleGuest = {
			name: 'Jane Doe',
			email: 'jane@example.com',
		};
		const result = validateGuestInput(data, simpleGuestSchema);
		expect(result.isValid).toBe(true);
		expect(result.errors).toEqual({});
	});

	it('should return isValid false and field errors when data is invalid', () => {
		const data = {
			name: '',
			email: 'not-an-email',
		} as SimpleGuest;
		const result = validateGuestInput(data, simpleGuestSchema);
		expect(result.isValid).toBe(false);
		expect(result.errors).toHaveProperty('name');
		expect(result.errors).toHaveProperty('email');
	});

	it('should map first error per field from path', () => {
		const schema = z.object({
			name: z.string().min(2, 'Min 2 chars'),
			email: z.email('Bad email'),
		});
		const result = validateGuestInput(
			{ name: 'x', email: 'x' } as any,
			schema as any,
		);
		expect(result.isValid).toBe(false);
		expect(Object.keys(result.errors).sort()).toEqual(['email', 'name']);
	});
});
