import { describe, it, expect, vi } from 'vitest';
import { validateInputs } from './validate-input';

describe('validateInputs', () => {
	const baseFormData = {
		email: { value: '', errorMsg: '' },
		password: { value: '', errorMsg: '' },
	};

	it('returns true and clears errors when validation succeeds', () => {
		const setFormData = vi.fn();
		const result = validateInputs(
			{
				...baseFormData,
				email: { value: 'user@example.com', errorMsg: '' },
				password: { value: 'Password1!', errorMsg: '' },
			},
			setFormData,
		);
		expect(result).toBe(true);
		expect(setFormData).toHaveBeenCalledWith(
			expect.objectContaining({
				email: { value: 'user@example.com', errorMsg: '' },
				password: { value: 'Password1!', errorMsg: '' },
			}),
		);
	});

	it('returns false and sets all field errors when validation fails and no type', () => {
		const setFormData = vi.fn();
		const result = validateInputs(
			{
				email: { value: '', errorMsg: '' },
				password: { value: 'short', errorMsg: '' },
			},
			setFormData,
		);
		expect(result).toBe(false);
		expect(setFormData).toHaveBeenCalledWith(
			expect.objectContaining({
				email: expect.objectContaining({ errorMsg: expect.any(String) }),
				password: expect.objectContaining({ errorMsg: expect.any(String) }),
			}),
		);
	});

	it('returns false and sets only email error when type is email and email is invalid', () => {
		const setFormData = vi.fn();
		const result = validateInputs(
			{
				email: { value: 'not-an-email', errorMsg: '' },
				password: { value: 'Password1!', errorMsg: '' },
			},
			setFormData,
			'email',
		);
		expect(result).toBe(false);
		expect(setFormData).toHaveBeenCalledWith(
			expect.objectContaining({
				email: expect.objectContaining({
					errorMsg: 'Please enter a valid email address',
				}),
			}),
		);
	});

	it('returns false and sets only password error when type is password and password is invalid', () => {
		const setFormData = vi.fn();
		const result = validateInputs(
			{
				email: { value: 'user@example.com', errorMsg: '' },
				password: { value: 'nouppercase1!', errorMsg: '' },
			},
			setFormData,
			'password',
		);
		expect(result).toBe(false);
		expect(setFormData).toHaveBeenCalledWith(
			expect.objectContaining({
				password: expect.objectContaining({
					errorMsg: expect.stringContaining('uppercase'),
				}),
			}),
		);
	});

	it('returns true and clears field when type is provided but error is in another field', () => {
		const setFormData = vi.fn();
		// Email is valid; password is invalid. Validate only 'email' -> no error for email, so clear and return true
		const result = validateInputs(
			{
				email: { value: 'user@example.com', errorMsg: '' },
				password: { value: 'bad', errorMsg: 'some error' },
			},
			setFormData,
			'email',
		);
		expect(result).toBe(true);
		expect(setFormData).toHaveBeenCalledWith(
			expect.objectContaining({
				email: { value: 'user@example.com', errorMsg: '' },
			}),
		);
	});
});
