import { Box } from '@mui/material';
import GenerateSlots from '../components/booking/GenerateSlots';
import SessionPicker from '../components/booking/SessionPicker';
import NextPreviousButtons from '../components/booking/NextPreviousButtons';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useSlots } from '@hooks';

const Booking = () => {
	const { isLoading } = useSlots();

	/**
	 * FIXME - when there is slots in the basket and the user logs in,
	 * the slots disappear
	 */

	return (
		<Box
			sx={{
				minHeight: '100vh',
			}}
		>
			<SessionPicker />
			{isLoading ? (
				<LoadingSpinner sx={{ height: '200px' }} />
			) : (
				<>
					<GenerateSlots />
					<NextPreviousButtons />
				</>
			)}
		</Box>
	);
};

export default Booking;
