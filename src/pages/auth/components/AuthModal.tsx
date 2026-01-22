import React from 'react';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Box,
	Typography,
	Divider,
	useTheme,
	useMediaQuery,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useUI } from '@context';
import { LoginForm, LegacyRegister, OAuthButtons } from './';

const AuthModal = () => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const {
		isAuthModalOpen,
		closeAuthModal,
		authModalView,
		toggleAuthModalView,
	} = useUI();

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
					pt: 2,
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
