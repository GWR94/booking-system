import React, { useState } from 'react';
import { FormInput, ForgotPasswordDialog } from './'; // index exported
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import {
	Box,
	Link,
	TextField,
	Grid2 as Grid,
	FormControlLabel,
	Checkbox,
	Typography,
} from '@mui/material';
import validateInputs from '@utils/validateInput';
import { useAuth } from '@hooks';

interface LoginFormProps {
	onSuccess?: () => void;
	onRegisterClick?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
	onSuccess,
	onRegisterClick,
}) => {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [isLoading, setLoading] = useState(false);
	const [formData, setFormData] = useState<Omit<FormInput, 'name' | 'confirm'>>(
		{
			email: {
				value: '',
				errorMsg: '',
			},
			password: {
				value: '',
				errorMsg: '',
			},
		},
	);
	const [rememberMe, setRememberMe] = useState(false);
	const [open, setOpen] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleLegacySignin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		const isValid = validateInputs(formData, setFormData);
		if (!isValid) {
			setLoading(false);
			return;
		}
		const { email, password } = formData;
		try {
			await login({
				email: email.value,
				password: password.value,
			});

			if (onSuccess) {
				onSuccess();
			} else {
				setTimeout(() => {
					navigate('/book');
				}, 1500);
			}
		} catch (err) {
			console.error(err);
		}
		setLoading(false);
	};

	const { email, password } = formData;

	const shouldDisable =
		!email.value.length ||
		!password.value.length ||
		email.errorMsg.length > 0 ||
		password.errorMsg.length > 0;

	return (
		<Box
			component="form"
			onSubmit={handleLegacySignin}
			noValidate
			sx={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				gap: 2,
			}}
		>
			<TextField
				error={!!email.errorMsg}
				helperText={email.errorMsg}
				id="email"
				type="email"
				name="email"
				label="Email Address"
				value={email.value}
				onChange={(e) =>
					setFormData({
						...formData,
						email: {
							errorMsg: '',
							value: e.target.value,
						},
					})
				}
				onBlur={() => validateInputs(formData, setFormData, 'email')}
				placeholder="your@email.com"
				autoComplete="email"
				required
				fullWidth
				variant="outlined"
				color={email.errorMsg ? 'error' : 'primary'}
				sx={{ ariaLabel: 'email' }}
			/>
			<TextField
				error={!!password.errorMsg}
				helperText={password.errorMsg}
				name="password"
				placeholder="••••••"
				type="password"
				id="password"
				label="Password"
				value={password.value}
				onChange={(e) =>
					setFormData({
						...formData,
						password: {
							errorMsg: '',
							value: e.target.value,
						},
					})
				}
				onBlur={() => validateInputs(formData, setFormData, 'password')}
				autoComplete="current-password"
				required
				fullWidth
				variant="outlined"
				color={password.errorMsg ? 'error' : 'primary'}
			/>
			<Grid container alignItems="center">
				<Grid size={{ xs: 12, sm: 6 }}>
					<FormControlLabel
						control={
							<Checkbox
								color="primary"
								size="small"
								value={rememberMe}
								onChange={(e) => setRememberMe(e.currentTarget.checked)}
							/>
						}
						label="Remember me"
					/>
				</Grid>
				<Grid
					size={{ xs: 12, sm: 6 }}
					justifyContent="flex-end"
					alignItems="flex-end"
				>
					<Link
						component="button"
						type="button"
						onClick={handleClickOpen}
						variant="body2"
						sx={{
							display: 'flex',
							width: '100%',
							justifyContent: 'flex-end',
						}}
					>
						Forgot your password?
					</Link>
				</Grid>
			</Grid>
			<ForgotPasswordDialog open={open} handleClose={handleClose} />
			<LoadingButton
				type="submit"
				fullWidth
				loading={isLoading}
				variant="contained"
				disabled={shouldDisable}
				color="primary"
			>
				Sign In
			</LoadingButton>
			<Typography sx={{ textAlign: 'center' }}>
				Don&apos;t have an account?{' '}
				<span>
					{/* If onRegisterClick is provided (Modal), use it. Else use Link (Page) */}
					{onRegisterClick ? (
						<Link
							component="button"
							variant="body2"
							onClick={onRegisterClick}
							sx={{ alignSelf: 'center' }}
						>
							Sign up
						</Link>
					) : (
						<Link href="/register" variant="body2" sx={{ alignSelf: 'center' }}>
							Sign up
						</Link>
					)}
				</span>
			</Typography>
		</Box>
	);
};

export default LoginForm;
