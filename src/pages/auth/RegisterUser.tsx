import { Divider, Typography } from '@mui/material';
import { OAuthButtons, LegacyRegister } from './components';
import { SEO } from '../../components/layout';
import { Card } from '../../styles/themes';

const RegisterUser = () => {
	return (
		<Card variant="outlined">
			<SEO
				title="Create Account"
				description="Join The Short Grass today. Create an account to access premium golf simulation bays in Maidstone."
			/>
			<Typography
				component="h1"
				variant="h5"
				sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
			>
				Sign up
			</Typography>
			<LegacyRegister />
			<Divider>
				<Typography>or</Typography>
			</Divider>
			<OAuthButtons />
		</Card>
	);
};

export default RegisterUser;
