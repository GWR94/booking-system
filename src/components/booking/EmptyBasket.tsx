import { ShoppingBasketOutlined } from '@mui/icons-material';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const EmptyBasket = () => {
	const navigate = useNavigate();
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				p: 4,
				m: 2,
				border: 1,
				borderColor: 'grey.300',
				borderRadius: 2,
				backgroundColor: 'background.paper',
				boxShadow: 2,
				textAlign: 'center',
			}}
		>
			<ShoppingBasketOutlined
				sx={{ fontSize: 60, color: 'primary.main', mb: 2 }}
			/>
			<Typography variant="h5" gutterBottom>
				Your basket is empty.
			</Typography>
			<Typography variant="body1" sx={{ mb: 1 }}>
				It looks like you haven’t added any time slots to your booking basket.
			</Typography>
			<Typography variant="body2" sx={{ mb: 3 }}>
				To proceed with your booking, please browse available slots and add a
				session.
			</Typography>
			<Button
				variant="contained"
				color="primary"
				onClick={() => navigate('/book')}
			>
				Browse Available Slots
			</Button>
		</Box>
	);
};

export default EmptyBasket;
