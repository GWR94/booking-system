import {
	Box,
	Typography,
	Grid2 as Grid,
	CircularProgress,
	Container,
} from '@mui/material';
import Slot from './Slot';
import dayjs from 'dayjs';
import { useSlots } from '../../hooks/useSlots';

const TimeSlotBooking = () => {
	const { groupedTimeSlots, isLoading } = useSlots();

	return (
		<Container maxWidth="xl" sx={{ flexGrow: 1, p: 3 }}>
			<Grid container spacing={2}>
				{isLoading ? (
					<Box sx={{ display: 'flex', justifyContent: 'center' }}>
						<CircularProgress />
					</Box>
				) : Object.keys(groupedTimeSlots).length === 0 ? (
					<Box
						sx={{
							m: '10px auto',
						}}
					>
						<Typography variant="h6" align="center" gutterBottom>
							No available time slots
						</Typography>
						<Typography variant="h6" align="center" sx={{ fontSize: '1rem' }}>
							Please select a different date
						</Typography>
					</Box>
				) : (
					Object.keys(groupedTimeSlots)
						.sort((a, b) => {
							const aTime = dayjs(groupedTimeSlots[a][0].startTime).valueOf();
							const bTime = dayjs(groupedTimeSlots[b][0].startTime).valueOf();
							return aTime - bTime;
						})
						.map((key: string, i) => (
							<Slot key={i} slotKey={key} timeSlots={groupedTimeSlots} />
						))
				)}
			</Grid>
		</Container>
	);
};

export default TimeSlotBooking;
