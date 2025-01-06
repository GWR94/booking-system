import React, { useState } from 'react';
import {
	Box,
	Typography,
	Grid2 as Grid,
	Button,
	Card,
	CardActions,
	CardContent,
} from '@mui/material';
import dayjs from 'dayjs';
import { useSlots } from '../../context/SlotContext';
import SelectedSlot from './SelectedSlot';
import { GroupedSlot } from '../interfaces/SlotContext.i';

const TimeSlotBooking: React.FC = () => {
	const { groupedTimeSlots } = useSlots();
	const [selectedSlot, setSelectedSlot] = useState<GroupedSlot | null>(null);

	const renderAvailableTimeSlots = () => {
		return Object.keys(groupedTimeSlots).map((key: string, i) => {
			const startTime = dayjs(groupedTimeSlots[key][0].startTime).format(
				'h:mma',
			);
			const endTime = dayjs(groupedTimeSlots[key][0].endTime).format('h:mma');
			const availability =
				groupedTimeSlots[key].length > 3
					? 'Good Availability'
					: 'Limited Availability';

			return (
				<Grid size={{ md: 4, sm: 6, xs: 12 }} key={i}>
					<Card>
						<CardContent>
							<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
								{startTime} - {endTime}
							</Typography>
							<Typography variant="caption">{availability}</Typography>
						</CardContent>
						<CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
							<Button
								variant="outlined"
								color="primary"
								size="small"
								onClick={() => setSelectedSlot(groupedTimeSlots[key][0])}
							>
								Select Bay
							</Button>
							<Button variant="contained" color="primary" size="small">
								Checkout Bay
							</Button>
						</CardActions>
					</Card>
				</Grid>
			);
		});
	};

	return (
		<Box sx={{ flexGrow: 1, p: 3 }}>
			<Grid container spacing={2}>
				{renderAvailableTimeSlots()}
			</Grid>
			{selectedSlot && <SelectedSlot selectedSlot={selectedSlot} />}
		</Box>
	);
};

export default TimeSlotBooking;
