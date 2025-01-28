import React from 'react';
import { useSlots } from '../../context/SlotContext';
import { Paper, Typography, Button } from '@mui/material';
import dayjs from 'dayjs';
import { GroupedSlot } from '../interfaces/SlotContext.i';
import { useNavigate } from 'react-router-dom';
import { useBasket } from '../../context/BasketContext';

interface SelectedSlotProps {
	selectedSlot: GroupedSlot;
}

const SelectedSlot: React.FC<SelectedSlotProps> = ({ selectedSlot }) => {
	const { selectedDate, selectedBay } = useSlots();
	const { addToBasket } = useBasket();
	const navigate = useNavigate();

	const handleAddToBasket = () => {
		addToBasket(selectedSlot);
		navigate('/checkout');
	};

	return (
		selectedSlot && (
			<Paper elevation={3} sx={{ p: 2, mt: 3 }}>
				<Typography variant="h6">Booking Summary</Typography>
				<Typography>
					Bay: <em>{selectedSlot.bayId}</em>
				</Typography>
				<Typography>
					Date: <em>{selectedDate.format('dddd Do MMM YYYY')}</em>
				</Typography>
				<Typography>
					Time:{' '}
					<em>
						{dayjs(selectedSlot.startTime).format('h:mma') + ' - '}
						{dayjs(selectedSlot.endTime).format('h:mma')}
					</em>
				</Typography>
				<Button
					variant="contained"
					color="primary"
					sx={{ mt: 2 }}
					onClick={handleAddToBasket}
				>
					Add to Basket
				</Button>
			</Paper>
		)
	);
};

export default SelectedSlot;
