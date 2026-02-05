import {
	Box,
	Typography,
	Card,
	CardContent,
	Grid2 as Grid,
	IconButton,
	Stack,
	Chip,
	Divider,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
	CalendarMonth,
	AccessTime,
	Timer,
	SportsGolf,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import React from 'react';
import { useBasket, useAuth } from '@hooks';
import { calculateSlotPrice } from '@utils';
import type { GroupedSlot } from '../../booking/components/types';

type CheckoutItemProps = {
	slot: GroupedSlot;
	isCompleted?: boolean;
};

const CheckoutItem: React.FC<CheckoutItemProps> = ({ slot, isCompleted }) => {
	const { removeFromBasket } = useBasket();
	const { user } = useAuth();
	const { discountedPrice } = calculateSlotPrice(
		slot.startTime,
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
			elevation={0}
			sx={{
				mb: 2,
				borderRadius: 2,
				border: '1px solid',
				borderColor: 'divider',
				transition: 'all 0.2s ease-in-out',
				'&:hover': {
					borderColor: 'primary.main',
					bgcolor: 'background.paper',
					boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
				},
			}}
		>
			<CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
				<Grid container spacing={2} alignItems="center">
					{/* Bay Info */}
					<Grid size={{ xs: 12, sm: 3 }}>
						<Stack direction="row" spacing={1.5} alignItems="center">
							<Box
								sx={{
									bgcolor: 'primary.50',
									color: 'primary.main',
									p: 1,
									borderRadius: 1.5,
									display: 'flex',
								}}
							>
								<SportsGolf fontSize="small" />
							</Box>
							<Box>
								<Typography variant="subtitle2" color="text.secondary">
									Simulator
								</Typography>
								<Typography variant="subtitle1" fontWeight="700">
									Bay {slot.bayId}
								</Typography>
							</Box>
						</Stack>
					</Grid>

					{/* Date & Time */}
					<Grid size={{ xs: 6, sm: 4 }}>
						<Stack spacing={0.5}>
							<Stack direction="row" spacing={1} alignItems="center">
								<CalendarMonth
									fontSize="inherit"
									color="action"
									sx={{ fontSize: 16 }}
								/>
								<Typography variant="body2" fontWeight="500">
									{dayjs(slot.startTime).format('ddd Do MMM')}
								</Typography>
							</Stack>
							<Stack direction="row" spacing={1} alignItems="center">
								<AccessTime
									fontSize="inherit"
									color="action"
									sx={{ fontSize: 16 }}
								/>
								<Typography variant="body2" color="text.secondary">
									{dayjs(slot.startTime).format('HH:mm')} -{' '}
									{dayjs(slot.endTime).format('HH:mm')}
								</Typography>
							</Stack>
						</Stack>
					</Grid>

					{/* Duration & Price */}
					<Grid size={{ xs: 6, sm: 4 }}>
						<Stack
							direction="row"
							justifyContent="space-between"
							alignItems="center"
							height="100%"
						>
							<Stack spacing={0.5}>
								<Stack direction="row" spacing={1} alignItems="center">
									<Timer
										fontSize="inherit"
										color="action"
										sx={{ fontSize: 16 }}
									/>
									<Typography variant="body2" color="text.secondary">
										{durationString}
									</Typography>
								</Stack>
							</Stack>
							<Typography variant="h6" color="primary.main" fontWeight="700">
								£{totalPrice}
							</Typography>
						</Stack>
					</Grid>

					{/* Remove Action */}
					{!isCompleted && (
						<Grid
							size={{ xs: 12, sm: 1 }}
							display="flex"
							justifyContent="flex-end"
						>
							<IconButton
								size="small"
								onClick={() => removeFromBasket(slot)}
								sx={{
									color: 'text.disabled',
									'&:hover': {
										color: 'error.main',
										bgcolor: 'error.50',
									},
								}}
								aria-label="remove item"
							>
								<DeleteOutlineIcon fontSize="small" />
							</IconButton>
						</Grid>
					)}
				</Grid>
			</CardContent>
		</Card>
	);
};

export default CheckoutItem;
