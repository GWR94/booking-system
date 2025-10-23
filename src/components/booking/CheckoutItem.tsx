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
import { GroupedSlot } from '../interfaces/SlotContext.i';
import { useSession } from '../../hooks/useSession';
import { useBasket } from '../../hooks/useBasket';

type CheckoutItemProps = {
	slot: GroupedSlot;
	isCompleted?: boolean;
};

export const HOURLY_RATE = 4500;

const CheckoutItem: React.FC<CheckoutItemProps> = ({ slot, isCompleted }) => {
	const { selectedDate } = useSession();
	const { removeFromBasket } = useBasket();
	const SESSION_LENGTH = slot.slotIds.length;
	const totalPrice = ((HOURLY_RATE / 100) * SESSION_LENGTH).toFixed(2);

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
										{selectedDate.format('dddd Do MMM YYYY')}
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
										{dayjs(slot.endTime).diff(dayjs(slot.startTime), 'minute')}{' '}
										minutes
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
