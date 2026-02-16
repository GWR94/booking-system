'use client';

import { useAuth, useBasket, useSession } from '@hooks';
import { CheckCircle, Close } from '@mui/icons-material';
import {
	Grid2 as Grid,
	Card,
	CardActionArea,
	CardContent,
	Box,
	Typography,
	useTheme,
	SxProps,
} from '@mui/material';
import { GroupedSlot } from './types';

interface MobileSlotProps {
	slot: GroupedSlot;
	price: {
		originalPrice: number;
		discountedPrice: number;
		hasDiscount: boolean;
	};
	sx: SxProps;
	handleSlotClick: () => void;
	handleRemoveOne: () => void;
	basketCount: number;
	availability?: 'good' | 'fair' | 'limited' | 'unavailable';
}

const MobileSlot = ({
	slot,
	price,
	sx,
	handleSlotClick,
	handleRemoveOne,
	basketCount,
	availability,
}: MobileSlotProps) => {
	const theme = useTheme();
	const { isAdmin } = useAuth();

	const { selectedBay, selectedSession } = useSession();

	const { originalPrice, discountedPrice, hasDiscount } = price;
	const isInBasket = basketCount > 0;

	return (
		<Grid size={{ xs: 6, sm: 4 }}>
			<Card
				variant="outlined"
				sx={{
					...sx,
					height: '100%',
					borderRadius: 2,
					transition: 'all 0.2s ease',
					borderWidth: 2,
					boxShadow: isInBasket
						? `0 0 0 1px ${theme.palette.primary.main}`
						: 'none',
					display: 'flex',
					flexDirection: 'column',
					position: 'relative',
				}}
			>
				<CardActionArea
					onClick={(e) => {
						// For specific bay and already in basket: toggle (remove)
						if (selectedBay !== 5 && isInBasket) {
							handleRemoveOne();
						} else {
							// For Any Bay or not in basket: add
							handleSlotClick();
						}
					}}
					data-testid="slot-card-action-mobile"
					sx={{
						flex: 1,
						p: 1.5,
						pb: isInBasket ? 3 : 1.5,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<CardContent
						sx={{
							p: 0,
							'&:last-child': { p: 0 },
							textAlign: 'center',
							width: '100%',
						}}
					>
						{isInBasket && (
							<Box
								sx={{
									position: 'absolute',
									top: 6,
									left: 6,
									display: 'flex',
									alignItems: 'center',
									gap: 0.2,
								}}
							>
								{basketCount > 1 && (
									<Typography
										variant="caption"
										sx={{
											fontWeight: 800,
											color: 'primary.main',
											fontSize: 10,
										}}
									>
										{basketCount}x
									</Typography>
								)}
								<CheckCircle sx={{ fontSize: 14, color: 'primary.main' }} />
							</Box>
						)}

						{availability && (
							<Box
								data-testid="availability-dot"
								sx={{
									position: 'absolute',
									top: 8,
									right: 8,
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

						<Typography
							variant="subtitle1"
							sx={{
								fontWeight: 700,
								mb: 0.5,
								color: isInBasket ? 'primary.main' : 'text.primary',
							}}
						>
							{slot.startTime.format('h:mma')}
						</Typography>

						<Box
							sx={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'baseline',
								gap: 0.5,
							}}
						>
							<Typography
								variant="body2"
								sx={{
									fontWeight: 600,
									color: isInBasket ? 'primary.dark' : 'text.secondary',
								}}
							>
								£{(discountedPrice * selectedSession).toFixed(0)}
							</Typography>
							{hasDiscount && (
								<Typography
									variant="caption"
									sx={{
										textDecoration: 'line-through',
										color: 'text.disabled',
									}}
								>
									£{(originalPrice * selectedSession).toFixed(0)}
								</Typography>
							)}
						</Box>
					</CardContent>
				</CardActionArea>

				{isInBasket && !isAdmin && (
					<Box
						component="button"
						onClick={(e) => {
							e.stopPropagation();
							handleRemoveOne();
						}}
						sx={{
							position: 'absolute',
							bottom: 0,
							left: 0,
							width: '100%',
							py: 0.5,
							fontSize: '0.6rem',
							fontWeight: 700,
							color: 'error.main',
							background: 'rgba(255, 0, 0, 0.05)',
							border: 'none',
							borderTop: '1px solid',
							borderColor: 'divider',
							cursor: 'pointer',
							'&:active': {
								bgcolor: 'rgba(255, 0, 0, 0.1)',
							},
							textTransform: 'uppercase',
						}}
					>
						Remove
					</Box>
				)}
			</Card>
		</Grid>
	);
};

export default MobileSlot;
