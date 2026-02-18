import type { z } from 'zod';
import type { GuestUser } from '@features/checkout/components';

export interface ValidationResult {
	isValid: boolean;
	errors: Record<string, string>;
}

/**
 * Validates guest user input against a Zod schema.
 * Returns structured error messages for form display (all errors at once).
 */
export const validateGuestInput = <T extends GuestUser>(
	data: T,
	schema: z.ZodType<T>,
): ValidationResult => {
	const result = schema.safeParse(data);

	if (result.success) {
		return { isValid: true, errors: {} };
	}

	const errors: Record<string, string> = {};
	for (const issue of result.error.issues) {
		if (issue.path.length > 0) {
			const key = issue.path[0] as keyof GuestUser;
			errors[key as string] = issue.message;
		}
	}
	return { isValid: false, errors };
};

export default validateGuestInput;
