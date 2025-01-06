import { CssBaseline, Divider, Typography } from '@mui/material';
import OAuthButtons from '../components/auth/OAuthButtons';
import LegacyRegister from '../components/auth/LegacyRegister';
import { SignInContainer, Card } from '../styles/themes';

const RegisterUser = () => {
	return (
		<>
			<CssBaseline enableColorScheme />
			<SignInContainer
				direction="column"
				justifyContent="center" // Change to center
				alignItems="center" // Center horizontally
			>
				<Card variant="outlined">
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
			</SignInContainer>
		</>
	);
};

export default RegisterUser;
