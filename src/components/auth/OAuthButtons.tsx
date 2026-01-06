import { Box, Button } from '@mui/material';
import { GoogleIcon, FacebookIcon } from '../../assets/icons/CustomIcons';
import { X } from '@mui/icons-material';

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
		<Button
			fullWidth
			variant="outlined"
			href="/api/user/login/twitter"
			startIcon={<X />}
		>
			Sign {isLogin ? 'in ' : 'up '} with X
		</Button>
	</Box>
);

export default OAuthButtons;
