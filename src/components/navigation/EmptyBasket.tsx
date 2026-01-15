import { ShoppingBag } from '@mui/icons-material';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

type Props = {
	isMobile: boolean;
	onClose?: () => void;
};

const EmptyBasket = ({ isMobile = false, onClose }: Props) => {
	const navigate = useNavigate();
	return (
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
					color: isMobile ? 'rgba(255,255,255,0.8)' : 'text.disabled',
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
	);
};

export default EmptyBasket;
