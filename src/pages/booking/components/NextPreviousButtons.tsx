import { Box, Button } from '@mui/material';
import dayjs from 'dayjs';
import { useSession } from '@hooks';

const NextPreviousButtons = () => {
	const { setSelectedDate, selectedDate } = useSession();
	return (
		<Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
			<Button
				variant="outlined"
				color="primary"
				size="small"
				disabled={dayjs(selectedDate).isBefore(dayjs())}
				onClick={() => setSelectedDate(dayjs(selectedDate).subtract(1, 'day'))}
				sx={{
					mr: 2,
				}}
			>
				Previous Day
			</Button>
			<Button
				variant="contained"
				color="primary"
				size="small"
				onClick={() => setSelectedDate(dayjs(selectedDate).add(1, 'day'))}
			>
				Next Day
			</Button>
		</Box>
	);
};

export default NextPreviousButtons;
