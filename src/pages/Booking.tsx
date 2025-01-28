import { Container } from '@mui/material';
import GenerateSlots from '../components/booking/GenerateSlots';
import SessionPicker from '../components/booking/SessionPicker';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useSlots } from '../context/SlotContext';

export type SessionTimes = 1 | 2 | 3 | 4;
const Booking = () => {
	const { isLoading } = useSlots();
	return (
		<>
			<Container maxWidth="lg" sx={{ mt: 5 }}>
				<SessionPicker />
				{isLoading ? <LoadingSpinner sx={{ mt: 5 }} /> : <GenerateSlots />}
			</Container>
		</>
	);
};

export default Booking;
