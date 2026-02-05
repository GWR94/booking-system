import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useSnackbar } from '@context';
import { useAuth } from '@hooks';

const PrivateRoute: React.FC = () => {
	const { isAuthenticated, isLoading } = useAuth();
	const { showSnackbar } = useSnackbar();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			showSnackbar('You must be logged in to view this page', 'error');
			navigate('/', { replace: true });
		}
	}, [isLoading, isAuthenticated, showSnackbar, navigate]);

	if (isLoading) {
		return (
			<Box
				sx={{
					display: 'flex',
					alignContent: 'center',
					height: '100%',
					width: '100%',
					justifyContent: 'center',
				}}
			>
				<CircularProgress size="large" color="primary" />
			</Box>
		);
	}

	if (!isAuthenticated) return null;

	return <Outlet />;
};

export default PrivateRoute;
