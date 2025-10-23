import { Container } from '@mui/material';
import UserBookings from '../components/auth/UserBookings';
import UserProfile from '../components/auth/UserProfile';

const ProfilePage = () => {
	return (
		<Container sx={{ mt: 3 }}>
			<UserProfile />
			<UserBookings />
		</Container>
	);
};

export default ProfilePage;
