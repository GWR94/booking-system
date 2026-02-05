import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useSnackbar } from '@context';
import { useAuth } from '@hooks';
import { useEffect } from 'react';

const AdminRoute: React.FC = () => {
	const { isAuthenticated, isAdmin, isLoading } = useAuth();
	const { showSnackbar } = useSnackbar();

	useEffect(() => {
		if (!isLoading && isAuthenticated && !isAdmin) {
			showSnackbar('You must be an admin to view this page', 'error');
		}
	}, [isLoading, isAuthenticated, isAdmin, showSnackbar]);

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

	if (!isAuthenticated || !isAdmin) {
		return <Navigate to="/" replace />;
	}

	return <Outlet />;
};

export default AdminRoute;
