import {
	Button,
	Card,
	CardActions,
	CardContent,
	Chip,
	Grid2 as Grid,
	Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { GroupedTimeSlots } from '../interfaces/SlotContext.i';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useBasket } from '../../hooks/useBasket';
import { useAuth } from '../../hooks/useAuth';
import AdminBookingDialog from './AdminBookingDialog';

type SlotProps = {
	slotKey: string;
	timeSlots: GroupedTimeSlots;
};

const Slot = ({ timeSlots, slotKey }: SlotProps) => {
	const { addToBasket, basket } = useBasket();
	const { isAdmin } = useAuth();
	const navigate = useNavigate();

	// Get hourly slots for this time slot
	const hourlySlots = timeSlots[slotKey];

	// Find slots that aren't in the basket yet
	const availableSlots = hourlySlots.filter(
		(slot) =>
			!basket.some((basketSlot) =>
				basketSlot.slotIds.some((id) => slot.slotIds.includes(id)),
			),
	);

	// Get representative slot for display
	const slot = hourlySlots[0];
	const startTime = dayjs(slot.startTime).format('h:mma');
	const endTime = dayjs(slot.endTime).format('h:mma');
	const slotPassed = slot.endTime.isBefore(dayjs());

	// Dialog state
	const [adminDialogOpen, setAdminDialogOpen] = useState(false);

	// Set availability text and color
	let availabilityText = '';
	let availabilityColor: 'success' | 'warning' | 'error' = 'error';

	if (availableSlots.length >= 3) {
		availabilityText = 'Good Availability';
		availabilityColor = 'success';
	} else if (availableSlots.length === 2) {
		availabilityText = 'Limited Availability';
		availabilityColor = 'warning';
	} else if (availableSlots.length === 1) {
		availabilityText = 'Very Limited Availability';
		availabilityColor = 'error';
	} else {
		availabilityText = 'Fully Booked';
		availabilityColor = 'error';
	}

	const handleAddToBasket = () => {
		if (availableSlots.length > 0) {
			addToBasket(availableSlots[0]);
		}
	};

	return (
		<>
			<Grid size={{ lg: 3, md: 4, sm: 6, xs: 12 }}>
				<Card
					sx={{
						p: { xs: 0, sm: 1 },
					}}
				>
					<CardContent>
						<Typography variant="h6" sx={{ fontWeight: 'bold' }}>
							{startTime} - {endTime}
						</Typography>

						<Typography
							variant="subtitle2"
							gutterBottom
							sx={{ fontWeight: 100, color: 'gray' }}
						>
							{dayjs(slot.startTime).format('dddd Do MMMM')}
						</Typography>
						{/* <Typography
							variant="body2"
							color="text.secondary"
							sx={{ mt: 1, mb: 2 }}
						>
							{slotPassed
								? 'This slot has passed.'
								: `Availability: ${availableSlots.length}/${hourlySlots.length}`}
						</Typography> */}
						<Chip
							label={slotPassed ? 'Unavailable' : availabilityText}
							color={slotPassed ? 'error' : availabilityColor}
							size="small"
							sx={{ mt: 1 }}
						/>
					</CardContent>
					<CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
						{isAdmin ? (
							<>
								<Button
									variant="contained"
									color="primary"
									size="small"
									sx={{
										textTransform: 'none',
									}}
									onClick={() => setAdminDialogOpen(true)}
								>
									Book Slot
								</Button>
							</>
						) : (
							<>
								<Button
									variant="outlined"
									disabled={slotPassed || availableSlots.length === 0}
									color="primary"
									size="small"
									sx={{
										textTransform: 'none',
									}}
									onClick={handleAddToBasket}
								>
									{availableSlots.length === 0 ? 'Sold Out' : 'Add to Basket'}
								</Button>
								<Button
									variant="contained"
									color="primary"
									size="small"
									disabled={slotPassed || availableSlots.length === 0}
									sx={{
										textTransform: 'none',
									}}
									onClick={() => {
										handleAddToBasket();
										navigate('/checkout');
									}}
								>
									Checkout
								</Button>
							</>
						)}
					</CardActions>
				</Card>
			</Grid>

			{/* Admin booking dialog */}
			<AdminBookingDialog
				open={adminDialogOpen}
				onClose={() => setAdminDialogOpen(false)}
				slots={hourlySlots}
				startTime={slot.startTime.format()}
				endTime={slot.endTime.format()}
			/>
		</>
	);
};

export default Slot;
