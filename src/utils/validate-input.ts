import { FormInput } from '@features/auth/components';
import { LoginForm } from '@features/auth/components/types';
import { loginSchema } from '@validation/form-schemas';

type FormInputType = 'email' | 'password';

/**
 * Validates login form inputs and updates form state with error messages.
 * Can validate all fields at once or a single field (for real-time validation).
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

	const result = loginSchema.safeParse(validationData);

	if (result.success) {
		setFormData({
			...formData,
			email: { ...formData.email, errorMsg: '' },
			password: { ...formData.password, errorMsg: '' },
		});
		return true;
	}

	const issues = result.error.issues;
	let updatedFormData = formData;

	if (type) {
		const err = issues.find((i) => i.path[0] === type);
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
		}
		updatedFormData = {
			...updatedFormData,
			[type]: { ...updatedFormData[type], errorMsg: '' },
		};
		setFormData(updatedFormData);
		return true;
	}

	for (const issue of issues) {
		const key = issue.path[0] as keyof typeof formData;
		if (key in updatedFormData) {
			updatedFormData = {
				...updatedFormData,
				[key]: {
					...updatedFormData[key],
					errorMsg: issue.message,
				},
			};
		}
	}
	setFormData(updatedFormData);
	return false;
};

export { validateInputs };
export default validateInputs;
