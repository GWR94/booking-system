// PrivateRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const PrivateRoute: React.FC = () => {
	const { isAuthenticated, isLoading } = useAuth();

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
		return <Navigate to="/login" replace />;
	}

	return <Outlet />;
};

export default PrivateRoute;
