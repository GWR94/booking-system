import Joi from 'joi';
import { GuestUser } from '@components/checkout';

interface ValidationResult {
	isValid: boolean;
	errors: Record<string, string>;
}

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

export default validateGuestInput;
