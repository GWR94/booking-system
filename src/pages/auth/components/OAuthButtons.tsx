import { Box, Button } from '@mui/material';
import { GoogleIcon, FacebookIcon, XIcon } from '@assets/icons/CustomIcons';

const OAuthButtons = () => {
	const backendUrl = import.meta.env.VITE_BACKEND_API!;

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
			<Button
				fullWidth
				variant="outlined"
				href={`${backendUrl}/api/user/login/google`}
				startIcon={<GoogleIcon />}
			>
				Continue with Google
			</Button>
			<Button
				fullWidth
				variant="outlined"
				href={`${backendUrl}/api/user/login/facebook`}
				startIcon={<FacebookIcon />}
			>
				Continue with Facebook
			</Button>
			<Button
				fullWidth
				variant="outlined"
				href={`${backendUrl}/api/user/login/twitter`}
				startIcon={<XIcon />}
			>
				Continue with X
			</Button>
		</Box>
	);
};

export default OAuthButtons;
