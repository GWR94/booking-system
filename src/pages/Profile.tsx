import { Container } from '@mui/material';
import UserBookings from '../components/profile/UserBookings';
import UserProfile from '../components/profile/UserProfile';

const ProfilePage = () => {
	return (
		<Container sx={{ mt: 3 }}>
			<UserProfile />
			<UserBookings />
		</Container>
	);
};

export default ProfilePage;
