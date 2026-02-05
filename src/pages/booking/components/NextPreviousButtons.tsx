import { Box, Button } from '@mui/material';
import dayjs from 'dayjs';
import { useSession } from '@hooks';
import { ArrowForward, ArrowBack } from '@mui/icons-material';

const NextPreviousButtons = () => {
	const { setSelectedDate, selectedDate } = useSession();
	return (
		<Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
			<Button
				variant="outlined"
				color="primary"
				disabled={dayjs(selectedDate).isBefore(dayjs())}
				onClick={() => setSelectedDate(dayjs(selectedDate).subtract(1, 'day'))}
				startIcon={<ArrowBack />}
				sx={{
					mr: 2,
					fontSize: '0.8rem',
					py: 0.5,
				}}
			>
				Previous Day
			</Button>
			<Button
				variant="outlined"
				color="primary"
				onClick={() => setSelectedDate(dayjs(selectedDate).add(1, 'day'))}
				endIcon={<ArrowForward />}
				sx={{
					py: 0.5,
					fontSize: '0.8rem',
				}}
			>
				Next Day
			</Button>
		</Box>
	);
};

export default NextPreviousButtons;
