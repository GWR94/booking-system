'use client';

import { Delete } from '@mui/icons-material';
import {
	Box,
	Avatar,
	Typography,
	Tooltip,
	IconButton,
	useTheme,
} from '@mui/material';
import dayjs from 'dayjs';
import { useBasket, useAuth } from '@hooks';
import { GroupedSlot } from '@features/booking/components';
import { calculateSlotPrice } from '@utils';

type Props = {
	item: GroupedSlot;
	isMobile: boolean;
};

const BasketItem = ({ item, isMobile }: Props) => {
	const theme = useTheme();
	const { removeFromBasket } = useBasket();
	const { user } = useAuth();
	const { discountedPrice, originalPrice, hasDiscount } = calculateSlotPrice(
		item.startTime,
		user?.membershipTier,
		user?.membershipStatus === 'ACTIVE',
	);
	return (
		<Box
			sx={{
				mb: 1,
				p: 0.5,
				borderRadius: 1,
				...(!isMobile && {
					'&:hover': {
						backgroundColor: theme.palette.action.hover,
					},
				}),
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
			}}
		>
			<Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
				<Avatar
					sx={{
						bgcolor: theme.palette.secondary.main,
						width: 20,
						height: 20,
						mr: 1,
						fontSize: '0.9rem',
					}}
				>
					{item.bayId}
				</Avatar>
				<Box>
					<Typography variant="body1" fontWeight="medium">
						{dayjs(item.startTime).format('ddd, MMM D')}
					</Typography>
					<Typography
						variant="body2"
						sx={{
							color: isMobile
								? 'rgba(255,255,255,0.6)'
								: theme.palette.primary.main,
						}}
					>
						{`${dayjs(item.startTime).format('h:mm A')} - ${dayjs(
							item.endTime,
						).format('h:mm A')}`}
					</Typography>
					<Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, gap: 1 }}>
						{hasDiscount && (
							<Typography
								variant="body2"
								sx={{
									textDecoration: 'line-through',
									color: isMobile
										? 'rgba(255,255,255,0.5)'
										: theme.palette.text.secondary,
									fontSize: '0.8rem',
								}}
							>
								£{(item.slotIds.length * originalPrice).toFixed(2)}
							</Typography>
						)}
						<Typography
							variant="body2"
							sx={{
								fontWeight: 'bold',
								color: isMobile
									? 'rgba(255,255,255,0.8)'
									: theme.palette.primary.main,
							}}
						>
							£{(item.slotIds.length * discountedPrice).toFixed(2)}
						</Typography>
					</Box>
				</Box>
			</Box>
			<Tooltip title="Remove" arrow placement="top">
				<IconButton
					size="small"
					onClick={() => removeFromBasket(item)}
					sx={{
						color: theme.palette.error.main,
						'&:hover': {
							backgroundColor: `${theme.palette.error.light}30`,
						},
						ml: 2,
					}}
				>
					<Delete fontSize="small" />
				</IconButton>
			</Tooltip>
		</Box>
	);
};

export default BasketItem;
