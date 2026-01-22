import { FormInput } from '../pages/auth/components';
import { LoginForm } from '../pages/auth/components/types';
import { loginSchema } from '../validation/schema';
type FormInputType = 'email' | 'password';

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

export default validateInputs;
