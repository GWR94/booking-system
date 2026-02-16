'use client';

import { Box, Button, SxProps, Theme } from '@mui/material';
import { GoogleIcon, FacebookIcon, XIcon } from '@assets/icons/CustomIcons';
import { signIn } from 'next-auth/react';

interface ButtonsProps {
	buttonSx?: SxProps<Theme>;
	iconOnly?: boolean;
}

const OAuthButtons = ({ buttonSx, iconOnly = false }: ButtonsProps) => {
	const handleOAuthSignIn = (provider: 'google' | 'facebook' | 'twitter') => {
		signIn(provider, { callbackUrl: '/book' });
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
			<Button
				fullWidth
				variant="outlined"
				onClick={() => handleOAuthSignIn('google')}
				startIcon={<GoogleIcon />}
				sx={{ ...buttonSx }}
			>
				{!iconOnly && 'Continue with Google'}
			</Button>
			<Button
				fullWidth
				variant="outlined"
				onClick={() => handleOAuthSignIn('facebook')}
				startIcon={<FacebookIcon />}
				sx={{ ...buttonSx }}
			>
				{!iconOnly && 'Continue with Facebook'}
			</Button>
			<Button
				fullWidth
				variant="outlined"
				onClick={() => handleOAuthSignIn('twitter')}
				startIcon={<XIcon />}
				sx={{ ...buttonSx }}
			>
				{!iconOnly && 'Continue with X'}
			</Button>
		</Box>
	);
};

export default OAuthButtons;
