import { LoadingButton } from '@mui/lab';
import {
	Box,
	TextField,
	FormControlLabel,
	Checkbox,
	Typography,
	Link,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrationSchema } from '@validation/schema';
import { FormInput, FormInputType } from './types';
import { useAuth } from '@hooks';

interface LegacyRegisterProps {
	onSuccess?: () => void;
	onLoginClick?: () => void;
}

const LegacyRegister: React.FC<LegacyRegisterProps> = ({
	onSuccess,
	onLoginClick,
}) => {
	const { register, isLoading } = useAuth();
	const navigate = useNavigate();
	const [formInput, setFormInput] = useState<FormInput>({
		name: {
			value: '',
			errorMsg: '',
		},
		email: {
			value: '',
			errorMsg: '',
		},
		password: {
			value: '',
			errorMsg: '',
		},
		confirm: {
			value: '',
			errorMsg: '',
		},
	});
	const [allowMarketing, setMarketing] = useState(false);
	const [submitError, setSubmitError] = useState(false);

	const validateInputs = (type?: FormInputType): boolean => {
		const validationData = {
			name: formInput.name.value,
			email: formInput.email.value,
			password: formInput.password.value,
			confirm: formInput.confirm.value,
		};

		// get validation errors from joi validation library
		const { error } = registrationSchema.validate(validationData, {
			abortEarly: false,
		});

		if (error) {
			const updatedFormInput: FormInput = { ...formInput };
			if (type) {
				// filter out others to return error which matches the input type
				const err = error.details?.filter(
					(detail) => detail.path[0] === type,
				)[0];
				if (err) {
					setFormInput({
						...formInput,
						[type]: {
							...formInput[type],
							errorMsg: err.message,
						},
					});
					return false;
				} else {
					setFormInput({
						...formInput,
						[type]: {
							...formInput[type],
							errorMsg: '',
						},
					});
					return true;
				}
			}
			error.details.forEach((detail) => {
				// get key for incorrectly validated
				const key = detail.path[0] as keyof typeof formInput;
				if (key in updatedFormInput) {
					updatedFormInput[key] = {
						...updatedFormInput[key],
						errorMsg: detail.message,
					};
				}
				setFormInput(updatedFormInput);
			});
			return false;
		} else {
			// clear all error messages if there are no validation errors.
			setFormInput((prevData) => ({
				...prevData,
				name: { ...prevData.name, errorMsg: '' },
				email: { ...prevData.email, errorMsg: '' },
				password: { ...prevData.password, errorMsg: '' },
				confirm: { ...prevData.confirm, errorMsg: '' },
			}));
			return true;
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const isValid = validateInputs();
		if (!isValid) return;
		try {
			await register({
				name: formInput.name.value,
				email: formInput.email.value,
				password: formInput.password.value,
			});

			if (onSuccess) {
				onSuccess();
			} else {
				navigate('/');
			}
		} catch (error) {
			setSubmitError(true);
		}
	};
	return (
		<>
			<Box
				component="form"
				sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
			>
				<TextField
					autoComplete="name"
					label="Full Name"
					name="name"
					required
					variant="outlined"
					fullWidth
					id="name"
					placeholder="John Doe"
					onChange={(e) =>
						setFormInput({
							...formInput,
							name: {
								...formInput.name,
								value: e.target.value,
							},
						})
					}
					onBlur={() => validateInputs('name')}
					error={!!formInput.name.errorMsg}
					helperText={formInput.name.errorMsg}
					color={formInput.name.errorMsg.length > 0 ? 'error' : 'primary'}
				/>
				<TextField
					required
					fullWidth
					id="email"
					placeholder="your@email.com"
					label="Email Address"
					variant="outlined"
					name="email"
					autoComplete="email"
					onChange={(e) =>
						setFormInput({
							...formInput,
							email: {
								...formInput.email,
								value: e.target.value,
							},
						})
					}
					onBlur={() => validateInputs('email')}
					error={!!formInput.email.errorMsg || submitError}
					helperText={formInput.email.errorMsg || submitError}
					color={formInput.email.errorMsg.length > 0 ? 'error' : 'primary'}
				/>
				<TextField
					required
					fullWidth
					label="Password"
					name="password"
					placeholder="••••••••••••"
					type="password"
					id="password"
					onChange={(e) =>
						setFormInput({
							...formInput,
							password: {
								...formInput.password,
								value: e.target.value,
							},
						})
					}
					onBlur={() => validateInputs('password')}
					autoComplete="new-password"
					variant="outlined"
					error={!!formInput.password.errorMsg}
					helperText={formInput.password.errorMsg}
					color={formInput.password.errorMsg.length > 0 ? 'error' : 'primary'}
				/>
				<TextField
					required
					fullWidth
					name="confirm-password"
					placeholder="••••••••••••"
					type="password"
					id="confirm-password"
					onChange={(e) =>
						setFormInput({
							...formInput,
							confirm: {
								...formInput.confirm,
								value: e.target.value,
							},
						})
					}
					onBlur={() => validateInputs('confirm')}
					autoComplete="confirm-password"
					variant="outlined"
					label="Confirm Password"
					error={!!formInput.confirm.errorMsg}
					helperText={formInput.confirm.errorMsg}
					color={formInput.confirm.errorMsg.length > 0 ? 'error' : 'primary'}
				/>
				<FormControlLabel
					control={
						<Checkbox
							value={allowMarketing}
							onChange={(e) => setMarketing(e.currentTarget.checked)}
							color="primary"
						/>
					}
					label="I want to receive updates via email."
				/>
				<LoadingButton
					type="submit"
					fullWidth
					variant="contained"
					color={submitError ? 'error' : 'primary'}
					onClick={handleSubmit}
					loading={isLoading}
				>
					{submitError ? 'Failed to Register' : 'Sign up'}
				</LoadingButton>
				<Typography sx={{ textAlign: 'center' }}>
					Already have an account?{' '}
					<span>
						{onLoginClick ? (
							<Link
								component="button"
								variant="body2"
								onClick={onLoginClick}
								sx={{ alignSelf: 'center' }}
							>
								Sign in
							</Link>
						) : (
							<Link href="/login" variant="body2" sx={{ alignSelf: 'center' }}>
								Sign in
							</Link>
						)}
					</span>
				</Typography>
			</Box>
		</>
	);
};

export default LegacyRegister;
