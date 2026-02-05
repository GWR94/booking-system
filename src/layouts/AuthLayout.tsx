import { Outlet } from 'react-router-dom';
import { Stack, styled } from '@mui/material';

const SignInContainer = styled(Stack)(({ theme }) => ({
	height: 'calc(100vh - 70px)',
	minHeight: '100%',
	padding: theme.spacing(2),
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	[theme.breakpoints.up('sm')]: {
		padding: theme.spacing(4),
	},
	'&::before': {
		content: '""',
		display: 'block',
		position: 'absolute',
		zIndex: -1,
		inset: 0,
		backgroundImage:
			'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
		backgroundRepeat: 'no-repeat',
		...theme.applyStyles('dark', {
			backgroundImage:
				'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
		}),
	},
}));

const AuthLayout = () => {
	return (
		<SignInContainer direction="column" justifyContent="center">
			<Outlet />
		</SignInContainer>
	);
};

export default AuthLayout;
