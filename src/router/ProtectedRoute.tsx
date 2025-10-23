// PrivateRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useSnackbar } from '../context/SnackbarContext';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute: React.FC = () => {
	const { isAuthenticated, isLoading } = useAuth();
	const { showSnackbar } = useSnackbar();

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

	if (!isAuthenticated) {
		showSnackbar('You must be logged in to view this page', 'error');
		return <Navigate to="/login" replace />;
	}

	return <Outlet />;
};

export default PrivateRoute;
