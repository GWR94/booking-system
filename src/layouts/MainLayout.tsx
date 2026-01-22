import { Box } from '@mui/material';
import { NavBar, Footer } from '@layout';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
			<NavBar />
			<Box component="main" sx={{ flex: 1 }}>
				<Outlet />
			</Box>
			<Footer />
		</Box>
	);
};

export default MainLayout;
