'use client';

import {
	Slide,
	Box,
	Container,
	Typography,
	Button,
	alpha,
	useTheme,
} from '@mui/material';
import { useBasket } from '@hooks';

type Props = {};

const CheckoutFooter = (props: Props) => {
	const theme = useTheme();
	const { basket, basketPrice, clearBasket } = useBasket();
	return (
		<Slide direction="up" in={basket.length > 0} mountOnEnter unmountOnExit>
			<Box
				sx={{
					position: 'fixed',
					bottom: 0,
					left: 0,
					right: 0,
					bgcolor: alpha(theme.palette.background.paper, 0.9),
					backdropFilter: 'blur(16px)',
					boxShadow: `0 -8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
					borderTop: '1px solid',
					borderColor: alpha(theme.palette.divider, 0.5),
					zIndex: 1000,
					p: { xs: 2, sm: 3 },
					display: 'flex',
					justifyContent: 'center',
				}}
			>
				<Container maxWidth="sm" sx={{ p: '0 !important' }}>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-between',
							gap: 2,
						}}
					>
						<Box>
							<Typography
								variant="caption"
								sx={{
									fontWeight: 700,
									letterSpacing: 1,
									textTransform: 'uppercase',
									color: 'text.secondary',
									display: 'block',
									mb: 0.5,
									fontSize: '0.7rem',
								}}
							>
								{basket.length} {basket.length === 1 ? 'Slot' : 'Slots'}{' '}
								Selected
							</Typography>
							<Typography
								variant="h5"
								sx={{
									fontWeight: 700,
									color: 'primary.main',
									lineHeight: 1,
								}}
							>
								£{basketPrice}
							</Typography>
						</Box>

						<Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
							<Button
								variant="text"
								color="inherit"
								onClick={() => clearBasket()}
								sx={{
									color: 'text.secondary',
									borderRadius: 2,
									px: 1.5,
									py: 1,
									fontWeight: 700,
									'&:hover': {
										color: 'error.main',
										bgcolor: alpha(theme.palette.error.main, 0.05),
									},
								}}
							>
								Clear
							</Button>
							<Button
								variant="contained"
								component="a"
								href="/checkout"
								onClick={(e) => {
									e.preventDefault();
									window.location.href = '/checkout';
								}}
								sx={{
									borderRadius: 2,
									px: { xs: 3, sm: 4 },
									py: 1,
									fontWeight: 700,
									boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
									'&:hover': {
										transform: 'translateY(-1px)',
										boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
									},
								}}
							>
								Checkout
							</Button>
						</Box>
					</Box>
				</Container>
			</Box>
		</Slide>
	);
};

export default CheckoutFooter;
