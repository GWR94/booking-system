import Joi from 'joi';
import { GuestUser } from '@features/checkout/components';

/**
 * Result of guest input validation
 */
interface ValidationResult {
	/** Whether the validation passed */
	isValid: boolean;
	/** Map of field names to error messages */
	errors: Record<string, string>;
}

/**
 * Validates guest user input against a Joi schema
 *
 * Performs validation and returns structured error messages
 * for form display. Collects all validation errors at once
 * (abortEarly: false) for better UX.
 *
 * @param data - Guest user data to validate
 * @param schema - Joi validation schema
 * @returns Validation result with isValid flag and error messages
 * @example
 * const result = validateGuestInput(
 *   { name: 'John', email: 'invalid-email', phone: '123' },
 *   guestSchema
 * );
 * // Returns: {
 * //   isValid: false,
 * //   errors: {
 * //     email: 'Please enter a valid email address',
 * //     phone: 'Phone number is not valid'
 * //   }
 * // }
 */
const validateGuestInput = (
	data: GuestUser,
	schema: Joi.ObjectSchema<GuestUser>,
): ValidationResult => {
	const { error } = schema.validate(data, { abortEarly: false });

	if (!error) {
		return { isValid: true, errors: {} };
	}

	const errors: Record<string, string> = {};
	error.details.forEach((detail) => {
		if (detail.path && detail.path.length > 0) {
			errors[detail.path[0] as keyof GuestUser] = detail.message;
		}
	});

	return { isValid: false, errors };
};

export { validateGuestInput };
export default validateGuestInput;
