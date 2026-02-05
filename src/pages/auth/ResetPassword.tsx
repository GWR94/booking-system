import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
	Typography,
	Button,
	TextField,
	Box,
	InputAdornment,
	IconButton,
	Card,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { resetPassword } from '@api';
import { useSnackbar, useUI } from '@context';
import { styled } from '@mui/material/styles';

const AuthCard = styled(Card)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	alignSelf: 'center',
	width: '100%',
	padding: theme.spacing(4),
	gap: theme.spacing(2),
	margin: 'auto',
	[theme.breakpoints.up('sm')]: {
		maxWidth: '450px',
	},
	boxShadow:
		'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
	...theme.applyStyles('dark', {
		boxShadow:
			'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
	}),
}));

const ResetPassword = () => {
	const [searchParams] = useSearchParams();
	const token = searchParams.get('token');

	const navigate = useNavigate();
	const { showSnackbar } = useSnackbar();
	const { openAuthModal } = useUI();

	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!token) {
			showSnackbar('Invalid or missing reset token.', 'error');
			return;
		}

		if (password !== confirmPassword) {
			showSnackbar('Passwords do not match.', 'error');
			return;
		}

		if (password.length < 8) {
			showSnackbar('Password must be at least 8 characters long.', 'error');
			return;
		}

		setLoading(true);
		try {
			await resetPassword({ token, password });
			showSnackbar(
				'Password has been reset successfully. Please login.',
				'success',
			);
			navigate('/');
			openAuthModal('login');
		} catch (error) {
			showSnackbar(
				'Failed to reset password. The link may have expired.',
				'error',
			);
		} finally {
			setLoading(false);
		}
	};

	if (!token) {
		return (
			<AuthCard variant="outlined">
				<Typography variant="h5" color="error" gutterBottom>
					Invalid Reset Link
				</Typography>
				<Typography variant="body2" color="text.secondary">
					The password reset link is missing or invalid. Please request a new
					one.
				</Typography>
				<Button
					fullWidth
					variant="contained"
					sx={{ mt: 2 }}
					onClick={() => {
						navigate('/');
						openAuthModal('login');
					}}
				>
					Back to Login
				</Button>
			</AuthCard>
		);
	}

	return (
		<AuthCard variant="outlined">
			<Typography component="h1" variant="h4" sx={{ width: '100%' }}>
				Reset Password
			</Typography>
			<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
				Please enter your new password below.
			</Typography>
			<Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
				<TextField
					margin="normal"
					required
					fullWidth
					name="password"
					label="New Password"
					type={showPassword ? 'text' : 'password'}
					id="password"
					autoComplete="new-password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					disabled={loading}
					slotProps={{
						input: {
							startAdornment: (
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={() => setShowPassword(!showPassword)}
										edge="end"
									>
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							),
						},
					}}
				/>
				<TextField
					margin="normal"
					required
					fullWidth
					name="confirmPassword"
					label="Confirm New Password"
					type={showPassword ? 'text' : 'password'}
					id="confirmPassword"
					autoComplete="new-password"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					disabled={loading}
				/>
				<LoadingButton
					type="submit"
					fullWidth
					variant="contained"
					sx={{ mt: 3, mb: 2 }}
					loading={loading}
					disabled={loading}
				>
					Reset Password
				</LoadingButton>
				<Button
					fullWidth
					variant="text"
					onClick={() => {
						navigate('/');
						openAuthModal('login');
					}}
					disabled={loading}
				>
					Back to Login
				</Button>
			</Box>
		</AuthCard>
	);
};

export default ResetPassword;
