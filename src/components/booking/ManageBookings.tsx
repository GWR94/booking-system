import { Container, Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import BookingSlot from './BookingSlot';
import { Booking } from '../interfaces/Booking.i';

const ManageBookings = () => {
	const { user } = useAuth();

	if (!user?.bookings || user?.bookings.length === 0) return null;

	return (
		<Container>
			<Typography>Manage Bookings</Typography>
			{user.bookings.map((booking: Booking, i: number) => (
				<BookingSlot booking={booking} key={i} />
			))}
		</Container>
	);
};

export default ManageBookings;
