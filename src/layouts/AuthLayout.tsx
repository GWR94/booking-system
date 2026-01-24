import { Outlet } from 'react-router-dom';
import { SignInContainer } from '@styles/themes';

const AuthLayout = () => {
	return (
		<SignInContainer direction="column" justifyContent="center">
			<Outlet />
		</SignInContainer>
	);
};

export default AuthLayout;
