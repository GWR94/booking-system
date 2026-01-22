import {
	Box,
	Typography,
	Card,
	CardContent,
	Grid2 as Grid,
	IconButton,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import dayjs from 'dayjs';
import React from 'react';
import { useBasket, useAuth } from '@hooks';
import { calculateSlotPrice } from '@utils';
import { GroupedSlot } from '../../booking/components';

type CheckoutItemProps = {
	slot: GroupedSlot;
	isCompleted?: boolean;
};

const CheckoutItem: React.FC<CheckoutItemProps> = ({ slot, isCompleted }) => {
	const { removeFromBasket } = useBasket();
	const { user } = useAuth();
	const { discountedPrice } = calculateSlotPrice(
		user?.membershipTier,
		user?.membershipStatus === 'ACTIVE',
	);
	const SESSION_LENGTH = slot.slotIds.length;
	const totalPrice = (discountedPrice * SESSION_LENGTH).toFixed(2);

	const durationInMinutes = dayjs(slot.endTime).diff(
		dayjs(slot.startTime),
		'minute',
	);
	const hours = Math.floor(durationInMinutes / 60);
	const minutes = durationInMinutes % 60;

	let durationString = `${durationInMinutes} minutes`;
	if (hours > 0) {
		durationString = `${hours} ${hours === 1 ? 'hr' : 'hrs'}`;
		if (minutes > 0) {
			durationString += ` ${minutes} mins`;
		}
	}

	return (
		<Card
			sx={{
				mb: 2,
				'&:hover': {
					boxShadow: 3,
					transition: '0.3s',
				},
			}}
		>
			<CardContent>
				<Grid container spacing={2} alignItems="center">
					<Grid size={{ xs: 12, sm: 10 }}>
						<Box>
							<Grid container spacing={2}>
								<Grid size={{ xs: 6 }}>
									<Typography variant="body2" color="text.secondary">
										Date
									</Typography>
									<Typography variant="body1" fontWeight="medium">
										{dayjs(slot.startTime).format('dddd Do MMM YYYY')}
									</Typography>
								</Grid>
								<Grid size={{ xs: 6 }}>
									<Typography variant="body2" color="text.secondary">
										Time
									</Typography>
									<Typography variant="body1" fontWeight="medium">
										{dayjs(slot.startTime).format('h:mma')} -{' '}
										{dayjs(slot.endTime).format('h:mma')}
									</Typography>
								</Grid>
								<Grid size={{ xs: 6 }}>
									<Typography variant="body2" color="text.secondary">
										Bay Number
									</Typography>
									<Typography variant="body1" fontWeight="medium">
										Bay {slot.bayId}
									</Typography>
								</Grid>
								<Grid size={{ xs: 6 }}>
									<Typography variant="body2" color="text.secondary">
										Duration
									</Typography>
									<Typography variant="body1" fontWeight="medium">
										{durationString}
									</Typography>
								</Grid>
							</Grid>
						</Box>
					</Grid>
					<Grid size={{ xs: 12, sm: 2 }}>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: { xs: 'flex-start', sm: 'flex-end' },
								height: '100%',
								justifyContent: 'space-between',
							}}
						>
							<Typography
								variant="h6"
								color="primary"
								sx={{ fontWeight: 'bold' }}
							>
								£{totalPrice}
							</Typography>
							{!isCompleted && (
								<IconButton
									onClick={() => removeFromBasket(slot)}
									color="error"
									sx={{ mt: 1 }}
									aria-label="remove item"
								>
									<DeleteOutlineIcon />
								</IconButton>
							)}
						</Box>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
};

export default CheckoutItem;
