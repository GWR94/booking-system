import { Box, Button, SxProps, Theme } from '@mui/material';
import { GoogleIcon, FacebookIcon, XIcon } from '@assets/icons/CustomIcons';

interface ButtonsProps {
	buttonSx?: SxProps<Theme>;
	iconOnly?: boolean;
}

const OAuthButtons = ({ buttonSx, iconOnly = false }: ButtonsProps) => {
	const backendUrl = import.meta.env.VITE_BACKEND_API;

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
			<Button
				fullWidth
				variant="outlined"
				href={`${backendUrl}/api/user/login/google`}
				startIcon={<GoogleIcon />}
				sx={{ ...buttonSx }}
			>
				{!iconOnly && 'Continue with Google'}
			</Button>
			<Button
				fullWidth
				variant="outlined"
				href={`${backendUrl}/api/user/login/facebook`}
				startIcon={<FacebookIcon />}
				sx={{ ...buttonSx }}
			>
				{!iconOnly && 'Continue with Facebook'}
			</Button>
			<Button
				fullWidth
				variant="outlined"
				href={`${backendUrl}/api/user/login/twitter`}
				startIcon={<XIcon />}
				sx={{ ...buttonSx }}
			>
				{!iconOnly && 'Continue with X'}
			</Button>
		</Box>
	);
};

export default OAuthButtons;
