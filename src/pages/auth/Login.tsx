import { OAuthButtons, LoginForm } from './components';
import { Typography, Divider } from '@mui/material';
import { SEO } from '@layout';
import { Card } from '../../styles/themes';

const Login = () => {
	return (
		<Card variant="outlined">
			<SEO
				title="Sign In - The Short Grass"
				description="Sign in to your account at The Short Grass to book sessions, manage your membership, and view your stats."
			/>
			<Typography component="h1" variant="h4" sx={{ width: '100%' }}>
				Sign in
			</Typography>
			<LoginForm />
			<Divider>or</Divider>
			<OAuthButtons />
		</Card>
	);
};

export default Login;
