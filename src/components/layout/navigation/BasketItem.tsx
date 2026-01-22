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
import { GroupedSlot } from '@pages/booking/components';
import { calculateSlotPrice } from '@utils';

type Props = {
	item: GroupedSlot;
	isMobile: boolean;
};

const BasketItem = ({ item, isMobile }: Props) => {
	const theme = useTheme();
	const { removeFromBasket } = useBasket();
	const { user } = useAuth();
	const { discountedPrice } = calculateSlotPrice(
		item.startTime,
		user?.membershipTier,
		user?.membershipStatus === 'ACTIVE',
	);
	return (
		<Box
			sx={{
				mb: 1,
				p: 1.5,
				borderRadius: 1,
				backgroundColor: isMobile
					? 'rgba(255,255,255,0.1)'
					: 'background.default',
				'&:hover': {
					backgroundColor: isMobile
						? 'rgba(255,255,255,0.15)'
						: theme.palette.action.hover,
				},
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
					<Typography
						variant="body2"
						sx={{
							fontWeight: 'bold',
							color: isMobile
								? 'rgba(255,255,255,0.8)'
								: theme.palette.primary.main,

							mt: 0.5,
						}}
					>
						£{(item.slotIds.length * discountedPrice).toFixed(2)}
					</Typography>
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
