import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	Chip,
	Grid2 as Grid,
	Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useBasket, useAuth } from '@hooks';
import AdminBookingDialog from './AdminBookingDialog';
import { GroupedTimeSlots } from './types';

type SlotProps = {
	timeRange: string;
	timeSlots: GroupedTimeSlots;
};

const Slot = ({ timeSlots, timeRange }: SlotProps) => {
	const { addToBasket, basket } = useBasket();
	const { isAdmin } = useAuth();
	const navigate = useNavigate();

	// Get hourly slots for this time slot
	const hourlySlots = timeSlots[timeRange];

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
			<Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
				<Card
					elevation={1}
					sx={{
						p: { xs: 0, sm: 1 },
						height: '100%',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'space-between',
						borderRadius: 3,
						transition: 'all 0.3s ease',
						border: '1px solid transparent',
						'&:hover': {
							transform: 'translateY(-4px)',
							boxShadow: `0 6px 12px rgba(0, 0, 0, 0.22)`,
						},
					}}
				>
					<CardContent>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'flex-start',
								mb: 1,
							}}
						>
							<Typography variant="h6" sx={{ fontWeight: 800 }}>
								{startTime} - {endTime}
							</Typography>
						</Box>

						<Typography
							variant="subtitle2"
							gutterBottom
							sx={{
								fontWeight: 500,
								color: 'text.secondary',
								display: 'flex',
								alignItems: 'center',
								gap: 0.5,
							}}
						>
							{dayjs(slot.startTime).format('dddd Do MMMM')}
						</Typography>

						<Chip
							label={slotPassed ? 'Unavailable' : availabilityText}
							color={slotPassed ? 'error' : availabilityColor}
							size="small"
							variant={slotPassed ? 'outlined' : 'filled'}
							sx={{
								mt: 2,
								fontWeight: 600,
								borderRadius: 1.5,
							}}
						/>
					</CardContent>
					{isAdmin ? (
						<CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
							{hourlySlots.map((slot) => (
								<Box
									component={Button}
									key={slot.id}
									variant="contained"
									color="primary"
									size="small"
									sx={{
										textTransform: 'none',
										minWidth: '40px',
										height: '30px',
									}}
									onClick={() => setAdminDialogOpen(true)}
								>
									Bay {slot.bayId}
								</Box>
							))}
						</CardActions>
					) : (
						<CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
						</CardActions>
					)}
				</Card>
			</Grid>

			{/* Admin booking dialog */}
			<AdminBookingDialog
				open={adminDialogOpen}
				onClose={() => setAdminDialogOpen(false)}
				slot={slot}
				startTime={slot.startTime.format()}
				endTime={slot.endTime.format()}
			/>
		</>
	);
};

export default Slot;
