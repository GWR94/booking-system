import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import { parseWithFirstError } from './zod';

const testSchema = z.object({
	name: z.string().min(1),
	age: z.number().int().positive(),
});

describe('parseWithFirstError', () => {
	it('returns success with parsed data when valid', () => {
		const result = parseWithFirstError(testSchema, { name: 'Jane', age: 30 });
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data).toEqual({ name: 'Jane', age: 30 });
		}
	});

	it('returns failure with first error message when invalid', () => {
		const result = parseWithFirstError(testSchema, { name: '', age: 30 });
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.message).toMatch(/name/);
		}
	});

	it('returns failure with path and message for nested errors', () => {
		const schema = z.object({ user: z.object({ email: z.string().email() }) });
		const result = parseWithFirstError(schema, { user: { email: 'not-an-email' } });
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.message).toMatch(/email|user/);
		}
	});
});
