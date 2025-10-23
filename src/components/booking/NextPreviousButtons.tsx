import { Box, Button } from '@mui/material';
import dayjs from 'dayjs';
import { useSession } from '../../hooks/useSession';

const NextPreviousButtons = () => {
	const { setSelectedDate, selectedDate } = useSession();
	return (
		<Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
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
				Previous
			</Button>
			<Button
				variant="contained"
				color="primary"
				size="small"
				onClick={() => setSelectedDate(dayjs(selectedDate).add(1, 'day'))}
			>
				Next
			</Button>
		</Box>
	);
};

export default NextPreviousButtons;
