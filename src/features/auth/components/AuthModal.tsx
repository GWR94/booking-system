import React, { useEffect, useRef } from 'react';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Box,
	Typography,
	Divider,
	Alert,
	useTheme,
	useMediaQuery,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useUI } from '@context';
import { useSearchParams } from 'next/navigation';
import { LoginForm, LegacyRegister, OAuthButtons } from './';

const getAuthErrorMessage = (error: string | null): string | null => {
	if (!error) return null;

	if (error === 'AccessDenied') {
		return 'Unable to sign in with that provider. Please use an account with a verified email or sign in with your password first.';
	}
	if (error === 'OAuthAccountNotLinked') {
		return 'This email is already linked to a different sign-in method. Please use your original method first.';
	}
	if (error === 'Callback') {
		return 'Authentication callback failed. Please try again.';
	}

	return 'Unable to complete sign-in. Please try again.';
};

const AuthModal = () => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const searchParams = useSearchParams();
	const {
		isAuthModalOpen,
		closeAuthModal,
		authModalView,
		toggleAuthModalView,
		openAuthModal,
	} = useUI();
	const authError = searchParams.get('error');
	const authErrorMessage = getAuthErrorMessage(authError);
	const lastAutoOpenedErrorRef = useRef<string | null>(null);

	useEffect(() => {
		if (!authError) return;
		if (lastAutoOpenedErrorRef.current === authError) return;

		openAuthModal('login');
		lastAutoOpenedErrorRef.current = authError;
	}, [authError, openAuthModal]);

	const handleClose = () => {
		closeAuthModal();
	};

	const handleSuccess = () => {
		closeAuthModal();
	};

	const isLogin = authModalView === 'login';

	return (
		<Dialog
			open={isAuthModalOpen}
			onClose={handleClose}
			fullScreen={fullScreen}
			maxWidth="xs"
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: fullScreen ? 0 : 2,
					p: 1,
				},
			}}
		>
			<DialogTitle
				sx={{
					p: 2,
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
					{isLogin ? 'Sign In' : 'Create Account'}
				</Typography>
				<IconButton
					aria-label="close"
					onClick={handleClose}
					sx={{
						color: (theme) => theme.palette.grey[500],
					}}
				>
					<Close />
				</IconButton>
			</DialogTitle>
			<DialogContent
				dividers={false}
				sx={{
					px: { xs: 2, sm: 4 },
					pt: 3,
					pb: 4,
					display: 'flex',
					flexDirection: 'column',
					flex: fullScreen ? 1 : 'none',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: 2,
						my: fullScreen ? 'auto' : 0,
					}}
				>
					{isLogin && authErrorMessage && (
						<Alert severity="error">{authErrorMessage}</Alert>
					)}
					{isLogin ? (
						<LoginForm
							onSuccess={handleSuccess}
							onRegisterClick={toggleAuthModalView}
						/>
					) : (
						<LegacyRegister
							onSuccess={handleSuccess}
							onLoginClick={toggleAuthModalView}
						/>
					)}
					<Divider sx={{ my: 1 }}>or</Divider>
					<OAuthButtons />
				</Box>
			</DialogContent>
		</Dialog>
	);
};

export default AuthModal;
