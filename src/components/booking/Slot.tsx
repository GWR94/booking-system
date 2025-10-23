import {
	Button,
	Card,
	CardActions,
	CardContent,
	Chip,
	Dialog,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Grid2 as Grid,
	Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { GroupedSlot, GroupedTimeSlots } from '../interfaces/SlotContext.i';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from '../../utils/axiosConfig';
import { Booking } from '../interfaces/Booking.i';
import { useBasket } from '../../hooks/useBasket';
import { useAuth } from '../../hooks/useAuth';

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
	const slotPassed = slot.startTime.isBefore(dayjs());

	// Dialog states
	const [pickDialogOpen, setPickDialogOpen] = useState(false);
	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
	const [booking, setBooking] = useState<Booking | null>(null);

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

	const handleAdminBookSlot = async (slot: GroupedSlot) => {
		const {
			data: { booking },
		} = await axios.post(`/api/booking`, {
			slotIds: slot.slotIds,
		});
		setBooking(booking);
		setConfirmDialogOpen(true);
	};

	// Handler for adding to basket
	const handleAddToBasket = () => {
		// If there are available slots, add the first one
		if (availableSlots.length > 0) {
			addToBasket(availableSlots[0]);
		}
	};

	// Handler for checkout now
	const handleCheckoutNow = () => {
		// If there are available slots, add the first one
		if (availableSlots.length > 0) {
			addToBasket(availableSlots[0]);
		}
		navigate('/checkout');
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
						<Typography
							variant="body2"
							color="text.secondary"
							sx={{ mt: 1, mb: 2 }}
						>
							{slotPassed
								? 'This slot has passed.'
								: `Availability: ${availableSlots.length}/${hourlySlots.length}`}
						</Typography>
						<Chip
							label={slotPassed ? 'Unavailable' : availabilityText}
							color={slotPassed ? 'error' : availabilityColor}
							size="small"
						/>
					</CardContent>
					<CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
						{isAdmin ? (
							<>
								{hourlySlots.length > 1 && (
									<Button
										variant="outlined"
										color="primary"
										size="small"
										sx={{ textTransform: 'none' }}
										onClick={() => setPickDialogOpen(true)}
									>
										Pick a Bay
									</Button>
								)}
								<Button
									variant="contained"
									color="primary"
									size="small"
									sx={{
										textTransform: 'none',
									}}
									onClick={() => handleAdminBookSlot(availableSlots[0] || slot)}
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
									onClick={handleCheckoutNow}
								>
									Checkout Now
								</Button>
							</>
						)}
					</CardActions>
				</Card>
			</Grid>

			{/* Pick dialog for admin */}
			<Dialog open={pickDialogOpen} onClose={() => setPickDialogOpen(false)}>
				<DialogTitle>Select a Bay</DialogTitle>
				<DialogContent>
					<DialogContentText>Pick a bay to book.</DialogContentText>
					<Grid container spacing={2}>
						{hourlySlots.map((slot) => (
							<Grid key={slot.id}>
								<Button
									variant="outlined"
									color="primary"
									onClick={() => handleAdminBookSlot(slot)}
								>
									Bay {slot.bayId}
								</Button>
							</Grid>
						))}
					</Grid>
				</DialogContent>
			</Dialog>

			{/* Confirmation dialog */}
			{booking && (
				<Dialog
					open={confirmDialogOpen}
					onClose={() => setConfirmDialogOpen(false)}
				>
					<DialogTitle>Booking Confirmed</DialogTitle>
					<DialogContent>
						<DialogContentText>
							<Typography>Your booking has been confirmed.</Typography>
							<Typography>Booking ID: {booking.id}</Typography>
							<Typography>
								Time:{' '}
								{`${dayjs(startTime).format('dddd Do MMMM HH:mma')} - ${dayjs(
									endTime,
								).format('HH:mma')}`}
							</Typography>
							<Typography>Bay: {booking.slots[0].bayId}</Typography>
						</DialogContentText>
					</DialogContent>
				</Dialog>
			)}
		</>
	);
};

export default Slot;
