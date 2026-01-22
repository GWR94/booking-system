import { UserProfile } from './components';
import { Box, Typography } from '@mui/material';

const Overview = () => {
	return (
		<Box>
			<Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>
				Profile Overview
			</Typography>
			<UserProfile />
		</Box>
	);
};

export default Overview;
