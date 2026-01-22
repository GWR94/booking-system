import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
	Typography,
	Button,
	TextField,
	Box,
	InputAdornment,
	IconButton,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Card, SignInContainer } from '../../styles/themes';
import { resetPassword } from '@api';
import { useSnackbar } from '@context';

const ResetPassword = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const { showSnackbar } = useSnackbar();
	const token = searchParams.get('token');

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
			navigate('/login');
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
			<SignInContainer>
				<Card variant="outlined">
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
						onClick={() => navigate('/login')}
					>
						Back to Login
					</Button>
				</Card>
			</SignInContainer>
		);
	}

	return (
		<SignInContainer>
			<Card variant="outlined">
				<Typography
					component="h1"
					variant="h4"
					sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
				>
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
						InputProps={{
							endAdornment: (
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
						onClick={() => navigate('/login')}
						disabled={loading}
					>
						Back to Login
					</Button>
				</Box>
			</Card>
		</SignInContainer>
	);
};

export default ResetPassword;
