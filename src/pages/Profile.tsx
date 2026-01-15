import { Container } from '@mui/material';
import { UserBookings, UserProfile } from '@components/profile';

const ProfilePage = () => {
	return (
		<Container sx={{ mt: 3 }}>
			<UserProfile />
			<UserBookings />
		</Container>
	);
};

export default ProfilePage;
