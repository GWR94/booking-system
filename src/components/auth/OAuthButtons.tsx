import { Box, Button } from '@mui/material';
import { GoogleIcon, FacebookIcon } from '../../assets/icons/CustomIcons';

interface OAuthButtonsProps {
	isLogin?: boolean;
}

const OAuthButtons = ({ isLogin = true }: OAuthButtonsProps) => (
	<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
		<Button
			fullWidth
			variant="outlined"
			href="/api/user/login/google"
			startIcon={<GoogleIcon />}
		>
			Sign {isLogin ? 'in ' : 'up '} with Google
		</Button>
		<Button
			fullWidth
			variant="outlined"
			href="/api/user/login/facebook"
			startIcon={<FacebookIcon />}
		>
			Sign {isLogin ? 'in ' : 'up '} with Facebook
		</Button>
	</Box>
);

export default OAuthButtons;
