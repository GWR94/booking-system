import { FormInput } from '@features/auth/components';
import { LoginForm } from '@features/auth/components/types';
import { loginSchema } from '@validation/form-schemas';

/**
 * Form input field types for validation
 */
type FormInputType = 'email' | 'password';

/**
 * Validates login form inputs and updates form state with error messages
 *
 * Can validate all fields at once or a single field (for real-time validation).
 * Automatically updates the form state with appropriate error messages.
 *
 * @param formData - Current form data with values and error messages
 * @param setFormData - State setter function to update form with errors
 * @param type - Optional specific field to validate (for real-time validation)
 * @returns True if validation passed, false if there are errors
 * @example
 * // Validate all fields on submit
 * const isValid = validateInputs(formData, setFormData);
 * if (isValid) {
 *   // Submit form
 * }
 *
 * @example
 * // Validate single field on blur
 * const emailValid = validateInputs(formData, setFormData, 'email');
 */
const validateInputs = (
	formData: Omit<FormInput, 'name' | 'confirm'>,
	setFormData: (formData: Omit<FormInput, 'name' | 'confirm'>) => void,
	type?: FormInputType,
): boolean => {
	const validationData: LoginForm = {
		email: formData.email.value,
		password: formData.password.value,
	};

	const { error } = loginSchema.validate(validationData, {
		abortEarly: false,
	});

	let updatedFormData: Omit<FormInput, 'name' | 'confirm'> = formData;
	if (error) {
		if (type) {
			// filter out others to return error which matches the input type
			const err = error.details?.filter((detail) => detail.path[0] === type)[0];
			if (err) {
				updatedFormData = {
					...updatedFormData,
					[type]: {
						...updatedFormData[type],
						errorMsg: err.message,
					},
				};
				setFormData(updatedFormData);
				return false;
			} else {
				updatedFormData = {
					...updatedFormData,
					[type]: {
						...updatedFormData[type],
						errorMsg: '',
					},
				};
				setFormData(updatedFormData);
				return true;
			}
		}
		error.details.forEach((detail) => {
			// get key for incorrectly validated
			const key = detail.path[0] as keyof typeof formData;
			if (key in updatedFormData) {
				updatedFormData[key] = {
					...updatedFormData[key],
					errorMsg: detail.message,
				};
			}
			setFormData(updatedFormData);
		});
		return false;
	} else {
		// clear all error messages if there are no validation errors.
		setFormData({
			...updatedFormData,
			email: { ...updatedFormData.email, errorMsg: '' },
			password: { ...updatedFormData.password, errorMsg: '' },
		});
		return true;
	}
};

export { validateInputs };
export default validateInputs;
