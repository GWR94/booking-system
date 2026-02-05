import { ShoppingCart } from '@mui/icons-material';
import { Typography, Button, Box, Badge, useTheme, List } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useBasket, useAuth } from '@hooks';
import { useUI } from '@context';
import EmptyBasket from './EmptyBasket';
import BasketItem from './BasketItem';

interface BasketContentProps {
	isMobile: boolean;
	onClose?: () => void;
}

const BasketContent = ({ onClose, isMobile }: BasketContentProps) => {
	const navigate = useNavigate();
	const { isAuthenticated } = useAuth();
	const { openAuthModal } = useUI();
	const { basket, basketPrice, clearBasket } = useBasket();
	const theme = useTheme();

	return (
		<Box
			sx={{
				borderRadius: 2,
				p: 2,
			}}
		>
			{/* Empty basket state */}
			{basket.length === 0 ? (
				<EmptyBasket isMobile={isMobile} onClose={onClose} />
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
						{basket.map((item) => (
							<BasketItem key={item.id} item={item} isMobile={isMobile} />
						))}
					</List>

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
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<Button
								fullWidth
								variant="contained"
								color="primary"
								size="small"
								sx={{
									mt: 2,
									mb: 1,
									borderRadius: 2,
									fontWeight: 'bold',
									boxShadow: 3,
									...(isMobile && {
										backgroundColor: 'white',
										color: 'primary.main',
									}),
								}}
								onClick={() => {
									if (isAuthenticated) {
										navigate('/checkout');
									} else {
										openAuthModal('login');
									}
									onClose && onClose();
								}}
							>
								{isAuthenticated
									? 'Continue to Checkout'
									: 'Sign in and Checkout'}
							</Button>
							{!isAuthenticated && (
								<Button
									variant="outlined"
									color="secondary"
									size="small"
									fullWidth
									onClick={() => navigate('/checkout')}
									sx={{
										fontSize: '0.8rem',
										color: isMobile
											? 'rgba(255,255,255,0.7)'
											: 'theme.secondary',
										'&:hover': {
											backgroundColor: 'transparent',
											color: isMobile ? 'white' : 'theme.secondary',
										},
									}}
								>
									Guest Checkout
								</Button>
							)}
						</Box>
					</Box>
				</Box>
			)}
		</Box>
	);
};

export default BasketContent;
