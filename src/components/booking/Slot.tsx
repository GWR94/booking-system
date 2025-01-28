import {
	Button,
	Card,
	CardActions,
	CardContent,
	Container,
	Grid2 as Grid,
	Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { iSlot } from '../interfaces/Booking.i';
import { GroupedTimeSlots } from '../interfaces/SlotContext.i';
import { useBasket } from '../../context/BasketContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

type SlotProps = {
	slotKey: string;
	timeSlots: GroupedTimeSlots;
};

// TODO
// [ ] set unavailable if time already gone

const Slot = ({ timeSlots, slotKey }: SlotProps) => {
	const { basket, addToBasket } = useBasket();
	const slot = timeSlots[slotKey][0];
	const startTime = dayjs(slot.startTime).format('h:mma');
	const endTime = dayjs(slot.endTime).format('h:mma');
	const availability =
		timeSlots[slotKey].length > 3
			? 'Good Availability'
			: 'Limited Availability';

	const selected = basket.some((basketItem) =>
		slot.slotIds.some((slotId) => slotId === basketItem.id),
	);
	const navigate = useNavigate();

	return (
		<Grid size={{ md: 4, sm: 6, xs: 12 }}>
			<Card>
				<CardContent>
					<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
						{startTime} - {endTime}
					</Typography>
					<Typography variant="caption">
						{availability}{' '}
						{timeSlots[slotKey].length > 1 &&
							`(${timeSlots[slotKey].length}/4)`}
					</Typography>
				</CardContent>
				<CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
					<Button
						variant="outlined"
						disabled={selected}
						color="primary"
						size="small"
						onClick={() => {
							addToBasket(slot);
						}}
					>
						{selected ? 'In Basket ✔' : 'Add to Basket'}
					</Button>
					<Button
						variant="contained"
						color="primary"
						size="small"
						onClick={() => {
							if (!selected) {
								addToBasket(slot);
							}
							navigate('/checkout');
						}}
					>
						Checkout Now
					</Button>
				</CardActions>
			</Card>
		</Grid>
	);
};

export default Slot;
