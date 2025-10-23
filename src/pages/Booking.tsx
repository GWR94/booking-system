import { Box, Button, useTheme } from '@mui/material';
import GenerateSlots from '../components/booking/GenerateSlots';
import SessionPicker from '../components/booking/SessionPicker';
import NextPreviousButtons from '../components/booking/NextPreviousButtons';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useSlots } from '../hooks/useSlots';

export type SessionTimes = 1 | 2 | 3 | 4;
const Booking = () => {
	const theme = useTheme();
	const { isLoading } = useSlots();

	/**
	 * FIXME - when there is slots in the basket and the user logs in,
	 * the slots disappear
	 */

	return (
		<Box
			sx={{
				background: theme.palette.grey[100],
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
