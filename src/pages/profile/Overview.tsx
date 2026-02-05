import { UserProfile } from './components';
import { Box } from '@mui/material';
import { SectionHeader } from '@ui';

const Overview = () => {
	return (
		<Box>
			<SectionHeader
				subtitle="PROFILE"
				title="Overview"
				description="View and edit your personal information"
			/>
			<UserProfile />
		</Box>
	);
};

export default Overview;
