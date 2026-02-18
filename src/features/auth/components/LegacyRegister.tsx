'use client';

import {
	Box,
	TextField,
	FormControlLabel,
	Checkbox,
	Typography,
	Link,
} from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registrationSchema } from '@validation/form-schemas';
import { FormInput, FormInputType } from './types';
import { useAuth } from '@hooks';
import { useUI } from '@context';
import { LoadingButton } from '@ui';

interface LegacyRegisterProps {
	onSuccess?: () => void;
	onLoginClick?: () => void;
}

const LegacyRegister: React.FC<LegacyRegisterProps> = ({
	onSuccess,
	onLoginClick,
}) => {
	const { register, isLoading } = useAuth();
	const { openAuthModal } = useUI();
	const router = useRouter();
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

		const result = registrationSchema.safeParse(validationData);

		if (result.success) {
			setFormInput((prev) => ({
				...prev,
				name: { ...prev.name, errorMsg: '' },
				email: { ...prev.email, errorMsg: '' },
				password: { ...prev.password, errorMsg: '' },
				confirm: { ...prev.confirm, errorMsg: '' },
			}));
			return true;
		}

		const issues = result.error.issues;
		if (type) {
			const err = issues.find((i) => i.path[0] === type);
			if (err) {
				setFormInput({
					...formInput,
					[type]: { ...formInput[type], errorMsg: err.message },
				});
				return false;
			}
			setFormInput({
				...formInput,
				[type]: { ...formInput[type], errorMsg: '' },
			});
			return true;
		}

		let updated: FormInput = { ...formInput };
		for (const issue of issues) {
			const key = issue.path[0] as keyof FormInput;
			if (key in updated) {
				updated = {
					...updated,
					[key]: { ...updated[key], errorMsg: issue.message },
				};
			}
		}
		setFormInput(updated);
		return false;
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
				router.push('/');
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
							<Link
								component="button"
								variant="body2"
								onClick={() => openAuthModal('login')}
								sx={{ alignSelf: 'center' }}
							>
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
