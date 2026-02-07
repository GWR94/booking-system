import { AccessTime, CheckCircle, Add, Delete } from '@mui/icons-material';
import {
	Grid2 as Grid,
	Card,
	CardContent,
	Box,
	Typography,
	Chip,
	CardActions,
	Button,
	useTheme,
	SxProps,
} from '@mui/material';
import dayjs from 'dayjs';
import { GroupedSlot } from './types';
import { useAuth, useBasket, useSession } from '@hooks';

type DesktopSlotProps = {
	slot: GroupedSlot;
	price: {
		originalPrice: number;
		discountedPrice: number;
		hasDiscount: boolean;
	};
	sx: SxProps;
	basketCount: number;
	availability?: 'good' | 'fair' | 'limited' | 'unavailable';
	children?: React.ReactNode;
};

const DesktopSlot = ({
	slot,
	price,
	sx,
	basketCount,
	availability,
	children,
}: DesktopSlotProps) => {
	const theme = useTheme();
	const { user } = useAuth();
	const { selectedBay, selectedSession } = useSession();

	const { startTime, endTime } = slot;
	const { originalPrice, discountedPrice, hasDiscount } = price;
	const isInBasket = basketCount > 0;

	return (
		<Grid size={{ md: 4, lg: 3, xl: 2 }}>
			<Card
				variant="outlined"
				sx={{
					...sx,
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					borderRadius: 3,
					transition: 'all 0.2s ease-in-out',
					borderWidth: 2,
					'&:hover': {
						boxShadow: theme.shadows[4],
						transform: 'translateY(-2px)',
					},
				}}
			>
				<CardContent sx={{ p: 2.5, flexGrow: 1 }}>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'flex-start',
							mb: 2,
						}}
					>
						<Box>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									gap: 1,
									mb: 0.5,
								}}
							>
								<AccessTime
									fontSize="small"
									sx={{
										color: isInBasket ? 'primary.main' : 'text.secondary',
									}}
								/>
								<Typography
									variant="h6"
									sx={{
										fontWeight: 700,
										color: isInBasket ? 'primary.main' : 'text.primary',
									}}
								>
									{dayjs(startTime).format('h:mma')} -{' '}
									{dayjs(endTime).format('h:mma')}
								</Typography>
							</Box>
							<Typography
								variant="caption"
								color="text.secondary"
								fontWeight={500}
							>
								{dayjs(startTime).format('dddd Do MMMM')}
							</Typography>
						</Box>
						{availability && (
							<Box
								data-testid="availability-dot"
								sx={{
									width: 8,
									height: 8,
									borderRadius: '50%',
									bgcolor:
										availability === 'good'
											? 'success.main'
											: availability === 'fair'
												? 'warning.main'
												: availability === 'limited'
													? 'error.main'
													: 'text.disabled',
								}}
							/>
						)}
					</Box>

					<Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
						<Typography
							variant="h5"
							color={isInBasket ? 'primary.main' : 'text.primary'}
							sx={{ fontWeight: 800 }}
						>
							£{(discountedPrice * selectedSession).toFixed(2)}
						</Typography>
						{hasDiscount && (
							<Typography
								variant="body2"
								sx={{
									textDecoration: 'line-through',
									color: 'text.disabled',
								}}
							>
								£{(originalPrice * selectedSession).toFixed(2)}
							</Typography>
						)}
					</Box>
					{user?.membershipTier && hasDiscount && (
						<Chip
							size="small"
							label="Member Price"
							color="secondary"
							variant="outlined"
							sx={{ height: 20, fontSize: '0.7rem' }}
						/>
					)}

					{selectedBay === 5 && (
						<Box
							sx={{
								mt: 1,
								display: 'flex',
								alignItems: 'center',
								gap: 0.5,
								minHeight: 24, // Reserve space to prevent layout shift
								visibility: basketCount > 0 ? 'visible' : 'hidden',
							}}
						>
							<CheckCircle color="accent" sx={{ fontSize: 16 }} />
							<Typography
								variant="caption"
								color="accent.main"
								fontWeight={700}
							>
								{basketCount} in basket
							</Typography>
						</Box>
					)}
				</CardContent>

				<CardActions
					sx={{
						p: 2.5,
						pt: 0,
						display: 'flex',
						gap: 1,
					}}
				>
					{children}
				</CardActions>
			</Card>
		</Grid>
	);
};

export default DesktopSlot;
