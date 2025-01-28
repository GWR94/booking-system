import { Box, Typography, Grid2 as Grid } from '@mui/material';
import { useSlots } from '../../context/SlotContext';
import Slot from './Slot';

const TimeSlotBooking = () => {
	const { groupedTimeSlots } = useSlots();

	return (
		<Box sx={{ flexGrow: 1, p: 3 }}>
			<Grid container spacing={2}>
				{Object.keys(groupedTimeSlots).length === 0 ? (
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
					Object.keys(groupedTimeSlots).map((key: string, i) => (
						<Slot key={i} slotKey={key} timeSlots={groupedTimeSlots} />
					))
				)}
			</Grid>
		</Box>
	);
};

export default TimeSlotBooking;
