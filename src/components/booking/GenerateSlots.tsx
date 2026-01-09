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

const GenerateSlots = () => {
	const { groupedTimeSlots, isLoading } = useSlots();

	const filteredSlots = Object.keys(groupedTimeSlots)
		.filter((key: string) => {
			const firstSlot = groupedTimeSlots[key][0];
			return dayjs(firstSlot.startTime).isAfter(dayjs());
		})
		.sort((a, b) => {
			const aTime = dayjs(groupedTimeSlots[a][0].startTime).valueOf();
			const bTime = dayjs(groupedTimeSlots[b][0].startTime).valueOf();
			return aTime - bTime;
		});

	return (
		<Container maxWidth="xl" sx={{ flexGrow: 1, p: 3 }}>
			<Grid
				container
				spacing={2}
				columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 10 }}
			>
				{isLoading ? (
					<Box sx={{ display: 'flex', justifyContent: 'center' }}>
						<CircularProgress />
					</Box>
				) : filteredSlots.length === 0 ? (
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
					filteredSlots.map((key: string, i: number) => (
						<Slot key={i} slotKey={key} timeSlots={groupedTimeSlots} />
					))
				)}
			</Grid>
		</Container>
	);
};

export default GenerateSlots;
