import { Delete, ShoppingBag, ShoppingCart } from '@mui/icons-material';
import {
	Typography,
	Button,
	Box,
	Tooltip,
	IconButton,
	Badge,
	useTheme,
	List,
	Avatar,
} from '@mui/material';
import dayjs from 'dayjs';
import { HOURLY_RATE } from '../components/booking/CheckoutItem';
import { useNavigate } from 'react-router-dom';
import { useBasket } from '../hooks/useBasket';
import { useAuth } from '../hooks/useAuth';

interface BasketContentProps {
	onClose?: () => void;
}

const BasketContent = ({ onClose }: BasketContentProps) => {
	const navigate = useNavigate();
	const { isAuthenticated } = useAuth();
	const { basket, removeFromBasket, basketPrice, clearBasket } = useBasket();
	const isMobile = window.innerWidth < 900;
	const theme = useTheme();

	return (
		<Box
			sx={{
				borderRadius: 2,
				p: 3,
			}}
		>
			{/* Header */}
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					borderBottom: `1px solid ${theme.palette.divider}`,
					mb: 1,
				}}
			>
				<Badge badgeContent={basket.length} color="accent" sx={{ mr: 1.5 }}>
					<ShoppingCart color="primary" />
				</Badge>
				<Typography
					variant="h6"
					component="h2"
					sx={{
						fontWeight: 'bold',
						color: isMobile ? 'white' : 'text.primary',
					}}
				>
					Your Basket
				</Typography>
			</Box>

			{/* Empty basket state */}
			{basket.length === 0 ? (
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<ShoppingBag
						sx={{
							fontSize: 50,
							color: isMobile ? 'rgba(255,255,255,0.5)' : 'text.disabled',
							mb: 1,
							mt: 2,
						}}
					/>
					<Typography
						variant="body1"
						align="center"
						sx={{
							color: isMobile ? 'white' : 'text.secondary',
							mb: 3,
							fontWeight: 'medium',
						}}
					>
						Your basket is empty
					</Typography>
					<Button
						fullWidth
						variant="contained"
						color="primary"
						sx={{
							py: 1,
							px: 3,
							borderRadius: 2,
							boxShadow: 2,
							fontWeight: 'medium',
							...(isMobile && {
								backgroundColor: 'white',
								color: 'primary.main',
							}),
						}}
						onClick={() => {
							navigate('/book');
							onClose && onClose();
						}}
					>
						Browse Available Slots
					</Button>
				</Box>
			) : (
				// Basket items
				<Box sx={{ display: 'flex', flexDirection: 'column' }}>
					<List
						sx={{
							maxHeight: 320,
							p: 0,
							overflowY: 'auto',
							'&::-webkit-scrollbar': {
								width: '8px',
							},
							'&::-webkit-scrollbar-track': {
								backgroundColor: 'rgba(0,0,0,0.05)',
								borderRadius: '10px',
							},
							'&::-webkit-scrollbar-thumb': {
								backgroundColor: 'rgba(0,0,0,0.2)',
								borderRadius: '10px',
							},
						}}
					>
						{basket.map((item, i) => (
							<Box
								key={i}
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
									{/* Optional: Add an Avatar for the bay */}
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
										<Typography variant="body2" color="text.secondary">
											{`${dayjs(item.startTime).format('h:mm A')} - ${dayjs(
												item.endTime,
											).format('h:mm A')}`}
										</Typography>
										<Typography
											variant="body2"
											sx={{
												fontWeight: 'bold',
												color: theme.palette.primary.main,
												mt: 0.5,
											}}
										>
											£{((item.slotIds.length * HOURLY_RATE) / 100).toFixed(2)}
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
						))}
					</List>

					{/* Summary section */}
					<Box
						sx={{
							mt: 2,
							pt: 2,
							borderTop: `1px dashed ${theme.palette.divider}`,
						}}
					>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								mb: 1,
							}}
						>
							<Typography
								variant="button"
								sx={{
									color: isMobile ? 'rgba(255,255,255,0.7)' : 'text.secondary',
								}}
							>
								TOTAL
							</Typography>
							<Typography
								sx={{
									fontWeight: 'bold',
									color: isMobile ? 'white' : theme.palette.primary.main,
								}}
							>
								£{basketPrice}
							</Typography>
						</Box>

						<Button
							fullWidth
							variant="contained"
							color="primary"
							sx={{
								mt: 2,
								mb: 1,
								// py: 1,
								borderRadius: 2,
								fontWeight: 'bold',
								boxShadow: 3,
								...(isMobile && {
									backgroundColor: 'white',
									color: 'primary.main',
								}),
							}}
							onClick={() => {
								isAuthenticated ? navigate('/checkout') : navigate('/login');
								onClose && onClose();
							}}
						>
							{isAuthenticated ? 'Proceed to Checkout' : 'Sign In to Checkout'}
						</Button>

						<Box
							sx={{
								display: 'flex',
								justifyContent: 'center',
								mt: 1,
							}}
						>
							<Button
								variant="text"
								color="inherit"
								size="small"
								onClick={() => clearBasket()}
								sx={{
									fontSize: '0.8rem',
									color: isMobile ? 'rgba(255,255,255,0.7)' : 'text.secondary',
									'&:hover': {
										backgroundColor: 'transparent',
										color: isMobile ? 'white' : 'text.primary',
									},
								}}
							>
								Clear Basket
							</Button>
						</Box>
					</Box>
				</Box>
			)}
		</Box>
	);
};

export default BasketContent;
